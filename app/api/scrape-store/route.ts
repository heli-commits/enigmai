export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";

const JINA_TIMEOUT_MS = 20_000;
const MAX_CONTENT_CHARS = 12_000;

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json().catch(() => ({}));
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const targetUrl = url.startsWith("http") ? url : `https://${url}`;

  // Use Jina reader for rich markdown content (full page body, not just meta tags)
  const jinaUrl = `https://r.jina.ai/${targetUrl}`;
  let pageContent = "";
  try {
    const res = await fetch(jinaUrl, {
      headers: {
        "Accept": "text/markdown",
        "User-Agent": "Mozilla/5.0 (compatible; EnigmAI/1.0)",
      },
      signal: AbortSignal.timeout(JINA_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Jina returned ${res.status}`);
    pageContent = await res.text();
  } catch {
    // Fallback: direct fetch + extract text
    try {
      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; EnigmAI/1.0)" },
        signal: AbortSignal.timeout(10_000),
      });
      const html = await res.text();
      // Strip tags for basic text extraction
      pageContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
    } catch {
      return NextResponse.json(
        { error: "לא ניתן לגשת לאתר. בדוק שהכתובת נכונה." },
        { status: 422 }
      );
    }
  }

  // Truncate to avoid excessive token usage while keeping the most useful content
  const content = pageContent.slice(0, MAX_CONTENT_CHARS);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `You are an expert at configuring Hebrew AI customer-support agents for Israeli online stores.
Your job is to read the full content of a store's website and extract detailed, rich persona and knowledge fields.
All output values MUST be in Hebrew. Be specific, use actual business details from the content.`;

  const userPrompt = `Analyze the following website content from ${targetUrl} and generate a complete AI agent configuration in Hebrew.

WEBSITE CONTENT:
${content}

Return a JSON object with EXACTLY these keys. Be thorough — especially for "knowledge" which must be comprehensive:

{
  "traits": "3-4 personality traits that fit this specific business, comma-separated (e.g. אמפתי, מקצועי, ידידותי, סבלני)",
  "role": "specific agent role title matching the business (e.g. מומחה ביגוד נשי, יועץ טכנולוגיה)",
  "greeting": "a warm, personalized opening greeting for THIS store's customers (1-2 sentences)",
  "style": "detailed communication style instructions based on the brand tone seen on the site (3-4 sentences)",
  "rules": "5-7 numbered specific behavioral rules relevant to this business type and its policies",
  "knowledge": "COMPREHENSIVE knowledge base including ALL of the following found on the site: (1) Business description and what makes it unique, (2) ALL products/services/categories offered with details, (3) ALL FAQs and their answers, (4) Shipping policy and delivery times, (5) Return/exchange policy, (6) Payment methods, (7) Target audience, (8) Operating hours and contact info, (9) Any promotions or special offers. Format as bullet points (•)."
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const persona = JSON.parse(completion.choices[0].message.content ?? "{}");
    return NextResponse.json({ persona });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "שגיאה לא ידועה";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
