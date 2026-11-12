import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** Heuristic fallback score when no AI key is configured (0–100). */
function heuristicScore(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  let score = 0;
  score += Math.min(40, words.length * 2); // length
  if (/[A-ZÄÖÜ]/.test(answer)) score += 10; // sentence starts
  if (/\.$|\?$|!$/.test(answer.trim())) score += 10; // punctuation
  if (/(weil|denn|obwohl|und|aber|dann|außerdem|trotzdem|allerdings)/i.test(answer)) score += 20; // connectors
  if (/(ge-|haben|sein|bin|war|hatte|hat)/i.test(answer)) score += 10; // verb structures
  return Math.max(10, Math.min(100, score));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { skill, level, task, answer, persist } = body;

  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL;
  const model = env.OPENAI_MODEL;

  let feedback = "Demo mode: configure OPENAI_API_KEY for AI feedback.";
  let correction: string | null = null;
  let modelAnswer: string | null = null;
  let score = heuristicScore(String(answer ?? ""));

  if (apiKey) {
    const system = `You are a German teacher (Goethe-Institut style) evaluating a ${level} learner's ${skill} task.
Task: ${task}
Learner answer: ${answer}
Return ONLY JSON with keys:
- feedback: encouraging feedback focused on task achievement + ONE main grammar point + ONE vocabulary suggestion (English or German)
- correction: corrected version of the learner's answer (German)
- modelAnswer: a model answer (German)
- score: integer 0-100 estimating how well the task was achieved (60 = pass, 80 = good, 95 = excellent)`;

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
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "{}";
        let parsed: any = {};
        try { parsed = JSON.parse(content); } catch { parsed = { feedback: content }; }
        feedback = parsed.feedback ?? "";
        correction = parsed.correction ?? null;
        modelAnswer = parsed.modelAnswer ?? null;
        if (typeof parsed.score === "number") score = Math.max(0, Math.min(100, Math.round(parsed.score)));
      } else {
        return NextResponse.json({ error: await res.text() }, { status: 500 });
      }
    } catch (e: any) {
      return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
    }
  }

  // Persist writing submissions so improvement can be tracked over time
  if (persist && skill === "schreiben") {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("writing_submissions").insert({
          user_id: user.id,
          level: String(level ?? "A1"),
          task: String(task ?? ""),
          text: String(answer ?? ""),
          score,
          feedback,
          correction,
          model_answer: modelAnswer,
        });
      }
    } catch {
      // non-fatal (e.g. migration not run yet)
    }
  }

  return NextResponse.json({ feedback, correction, modelAnswer, score });
}
