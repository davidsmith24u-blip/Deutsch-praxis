import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const { level, scenarioTitle, systemPrompt, memory, messages } = await req.json();

  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL;
  const model = env.OPENAI_MODEL;

  if (!apiKey) {
    // Fallback canned response so the UI works without keys
    return NextResponse.json({
      reply: "Hallo! Ich bin dein Gesprächspartner. (Set OPENAI_API_KEY for real AI responses.)",
      correction: null,
      feedback: "Demo mode: configure OPENAI_API_KEY to enable AI.",
      translation: "Hello! I am your conversation partner.",
      mistakes: [],
    });
  }

  const system = `You are a German conversation partner for CEFR level ${level}.
Scenario: ${scenarioTitle}. ${systemPrompt}
${memory ? `User memory: ${memory}` : ""}
Rules:
- Reply primarily in German appropriate to the level.
- Keep replies concise (1-3 sentences) and ask a follow-up question.
- Gently correct the user's last message if needed.
- Deliberately create opportunities to practice the user's weak points when possible.
- Return ONLY a JSON object with keys: reply (string, German), correction (string or null), feedback (string or null), translation (string or null English translation of reply), mistakes (array of objects {grammar_point, example, correction} for structured errors in the user's last message; empty array if none).`;

  const payload = {
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  };

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { reply: content };
    }
    return NextResponse.json({
      reply: parsed.reply ?? "…",
      correction: parsed.correction ?? null,
      feedback: parsed.feedback ?? null,
      translation: parsed.translation ?? null,
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}