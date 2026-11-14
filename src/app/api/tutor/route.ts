import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { messages, level, memory } = body ?? {};

  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL;
  const model = env.OPENAI_MODEL;

  // Build a lightweight learner memory from recent mistakes if not supplied
  let learnerMemory = memory;
  if (!learnerMemory && user) {
    const { data: prog } = await supabase
      .from("exercise_progress")
      .select("skill, completed, score")
      .eq("user_id", user.id);
    const counts: Record<string, { done: number; wrong: number }> = {};
    for (const r of prog ?? []) {
      const sk = (r as any).skill;
      if (!counts[sk]) counts[sk] = { done: 0, wrong: 0 };
      counts[sk].done += 1;
      if (!(r as any).completed) counts[sk].wrong += 1;
    }
    const weak = Object.entries(counts)
      .sort((a, b) => b[1].wrong - a[1].wrong)
      .slice(0, 2)
      .map(([sk]) => sk);
    learnerMemory = weak.length ? `Weaker skills: ${weak.join(", ")}.` : "Balanced progress so far.";
  }

  if (!apiKey) {
    // Demo fallback
    const last = (messages ?? []).slice(-1)[0]?.content ?? "";
    return NextResponse.json({
      reply: `Hallo! (Demo mode — set OPENAI_API_KEY for a real tutor.) Du hast gesagt: "${last}". Versuche, das auf Deutsch zu sagen!`,
      correction: null,
      feedback: "Demo mode active.",
      memory: learnerMemory,
    });
  }

  const system = `You are a friendly, patient German tutor for CEFR level ${level ?? "A1"}.
Learner memory: ${learnerMemory ?? "none yet"}.
Rules:
- Speak primarily in German appropriate to the level, with brief English glosses when needed.
- Keep replies concise (2-4 sentences) and end with a question to keep the conversation going.
- Gently correct grammar/vocabulary errors in the learner's last message.
- Reference the learner's weak skills when relevant and suggest one concrete next step (unit/topic).
- Return ONLY a JSON object with keys: reply (string, German), correction (string or null, English), feedback (string or null, English tip), memory (string, one-line updated learner note).`;

  const payload = {
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      ...(messages ?? []).map((m: any) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  };

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
      memory: parsed.memory ?? learnerMemory,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}
