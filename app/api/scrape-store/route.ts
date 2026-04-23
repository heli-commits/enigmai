export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json().catch(() => ({}));
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const targetUrl = url.startsWith("http") ? url : `https://${url}`;

  let html = "";
  try {
    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EnigmAI/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "לא ניתן לגשת לאתר. בדוק שהכתובת נכונה." }, { status: 422 });
  }

  const title       = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
  const ogTitle     = html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1]?.trim()
                   ?? html.match(/content="([^"]+)"\s+property="og:title"/i)?.[1]?.trim() ?? "";
  const description = html.match(/name="description"\s+content="([^"]+)"/i)?.[1]?.trim()
                   ?? html.match(/content="([^"]+)"\s+name="description"/i)?.[1]?.trim() ?? "";
  const ogDesc      = html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1]?.trim()
                   ?? html.match(/content="([^"]+)"\s+property="og:description"/i)?.[1]?.trim() ?? "";

  const siteName = ogTitle || title;
  const siteDesc = ogDesc  || description;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are configuring a Hebrew AI customer-support agent for an online store.
Based on the store metadata below, generate persona fields **in Hebrew**.

URL: ${targetUrl}
Title: ${siteName || "(unknown)"}
Description: ${siteDesc || "(none)"}

Return a JSON object with exactly these keys (all values must be in Hebrew):
{
  "traits":    "2-4 personality traits, comma-separated",
  "role":      "agent role title, e.g. מומחה שירות לקוחות",
  "greeting":  "warm opening greeting the agent uses",
  "style":     "communication style instructions (2-3 sentences)",
  "rules":     "3-5 numbered behavioral rules",
  "knowledge": "key facts about the store the agent must know"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 900,
    });

    const persona = JSON.parse(completion.choices[0].message.content ?? "{}");
    return NextResponse.json({ persona });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "שגיאה לא ידועה";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
