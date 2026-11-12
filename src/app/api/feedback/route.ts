import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const { skill, level, task, answer } = await req.json();

  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL;
  const model = env.OPENAI_MODEL;

  if (!apiKey) {
    return NextResponse.json({
      feedback: "Demo mode: configure OPENAI_API_KEY for AI feedback.",
      correction: null,
      modelAnswer: null,
    });
  }

  const system = `You are a German teacher (Goethe-Institut style) evaluating a ${level} learner's ${skill} task.
Task: ${task}
Learner answer: ${answer}
Return ONLY JSON with keys:
- feedback: encouraging feedback focused on task achievement + ONE main grammar point + ONE vocabulary suggestion (English or German)
- correction: corrected version of the learner's answer (German)
- modelAnswer: a model answer (German)`;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }],
        temperature: 0.5,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { feedback: content }; }
    return NextResponse.json({
      feedback: parsed.feedback ?? "",
      correction: parsed.correction ?? null,
      modelAnswer: parsed.modelAnswer ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}