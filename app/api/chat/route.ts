import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs"; // explicitly opt out of Edge Runtime

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestBody = {
  message: string;      // The user's new message
  session_id?: string;  // Omit on first turn; API creates a new session
  store_id?: string;    // Widget can pass a public store_id explicitly
};

type MessageParam = {
  role: "user" | "assistant";
  content: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_HISTORY = 20;

// ─── OpenAI client ────────────────────────────────────────────────────────────

function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── System prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(store: {
  name: string;
  about: string | null;
  agent_name: string;
  agent_persona: {
    traits?: string;
    rules?: string;
    style?: string;
  };
}): string {
  const persona = store.agent_persona ?? {};

  return [
    `אתה ${store.agent_name}, סוכן AI של החנות "${store.name}".`,
    ``,
    `## על החנות`,
    store.about ?? "חנות מקוונת.",
    ``,
    `## אופי`,
    persona.traits ?? "מקצועי, אדיב ועוזר.",
    ``,
    `## חוקי התנהגות`,
    persona.rules ?? "עזור ללקוח בכל שאלה הקשורה לחנות.",
    ``,
    `## סגנון דיבור`,
    persona.style ?? "עברית תקינה וידידותית.",
    ``,
    `## הוראות כלליות`,
    `- ענה תמיד בעברית.`,
    `- היה תמציתי – עד 3 משפטים בתגובה.`,
    `- אם אתה לא יודע משהו, אמור זאת בכנות.`,
    `- לעולם אל תמציא מחירים או פרטי מוצרים שלא סיפקו לך.`,
  ].join("\n");
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Debug: confirm key presence without exposing value ──────────────────────
  console.log("[chat] OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

  // 1. Fail fast if the key is missing (before any async work)
  if (!process.env.OPENAI_API_KEY) {
    console.error("[chat] OPENAI_API_KEY is not set – aborting");
    return Response.json({ error: "OPENAI_API_KEY is not configured on the server" }, { status: 500 });
  }

  // 2. Parse + validate body
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { message, session_id: incomingSessionId } = body;

  if (!message?.trim()) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const supabase = await createServerClient();

  // Resolve store_id: prefer explicit param, otherwise use the authenticated user's store
  let storeId = body.store_id ?? null;
  if (!storeId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", user.id)
        .single();
      storeId = store?.id ?? null;
    }
  }

  if (!storeId) {
    return Response.json({ error: "No store associated with this session" }, { status: 403 });
  }

  // 2. Fetch store config (system prompt source)
  const { data: store, error: storeErr } = await supabase
    .from("stores")
    .select("name, about, agent_name, agent_persona")
    .eq("id", storeId)
    .single();

  if (storeErr || !store) {
    console.error("Store fetch error:", storeErr?.message);
    return Response.json({ error: "Store not found" }, { status: 404 });
  }

  // 3. Resolve or create chat session
  let sessionId = incomingSessionId ?? null;

  if (!sessionId) {
    const { data: newSession, error: sessionErr } = await supabase
      .from("chat_sessions")
      .insert({ store_id: storeId, status: "active" })
      .select("id")
      .single();

    if (sessionErr || !newSession) {
      console.error("Session create error:", sessionErr?.message);
      return Response.json({ error: "Failed to create session" }, { status: 500 });
    }

    sessionId = newSession.id;
  }

  // 4. Load recent message history for context
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY);

  const historyMessages: MessageParam[] = (history ?? []).map((m) => ({
    role:    m.role === "agent" ? "assistant" : "user",
    content: m.content,
  }));

  // 5. Persist the user's message to DB
  await supabase.from("chat_messages").insert({
    session_id: sessionId,
    role:       "user",
    content:    message,
  });

  // 6. Call OpenAI GPT-4o
  const openai = getOpenAI();
  let aiReply: string;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system",    content: buildSystemPrompt(store as Parameters<typeof buildSystemPrompt>[0]) },
        ...historyMessages,
        { role: "user",      content: message },
      ],
      max_tokens:  500,
      temperature: 0.7,
    });

    aiReply = completion.choices[0]?.message?.content?.trim() ?? "סליחה, לא הצלחתי לעבד את הבקשה.";
  } catch (err) {
    console.error("OpenAI error:", err);
    return Response.json(
      { error: "AI service unavailable. Please try again shortly." },
      { status: 502 }
    );
  }

  // 7. Persist the AI response to DB
  await supabase.from("chat_messages").insert({
    session_id: sessionId,
    role:       "agent",
    content:    aiReply,
  });

  // 8. Return response to widget
  return Response.json({
    reply:      aiReply,
    session_id: sessionId,
  });
}
