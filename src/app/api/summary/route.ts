import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { level, scenarioTitle, messages } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({
      summary: "Demo mode: configure OPENAI_API_KEY for summaries.",
      mistakes: [],
    });
  }

  const system = `You are a German teacher. Summarize a conversation between a ${level} learner and an interviewer in scenario "${scenarioTitle}".
Return ONLY JSON with keys:
- summary: short paragraph (English) of what was discussed and overall performance.
- mistakes: array of objects {grammar_point, example, correction} for recurring or notable errors.`;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, ...messages],
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { summary: content, mistakes: [] }; }
    return NextResponse.json({
      summary: parsed.summary ?? "",
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}