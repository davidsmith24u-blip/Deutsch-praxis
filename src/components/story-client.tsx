"use client";

import { useState } from "react";
import Link from "next/link";
import type { Story } from "@/data/stories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoryQuiz({ story }: { story: Story }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const correct = story.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  );
  const allAnswered = story.questions.every((_, i) => answers[i]);

  const check = async () => {
    setChecked(true);
    // award XP via streak engine (+6 per correct, matching quick-exam style)
    try {
      await fetch("/api/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpGain: correct * 6 }),
      });
    } catch {
      // quiz feedback still shown
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comprehension questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {story.questions.map((q, i) => (
            <fieldset key={i} className="space-y-2">
              <legend className="font-medium">{i + 1}. {q.question}</legend>
              <div className="grid gap-1.5">
                {q.options.map((opt) => {
                  const isChosen = answers[i] === opt;
                  const isCorrect = checked && opt === q.answer;
                  const isWrongChoice = checked && isChosen && opt !== q.answer;
                  return (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                          : isWrongChoice
                            ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                            : isChosen
                              ? "border-primary"
                              : "hover:bg-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={isChosen}
                        disabled={checked}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                        className="accent-[var(--primary)]"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
              {checked && (
                <p className="text-xs text-muted-foreground">
                  {answers[i] === q.answer ? "✅ Richtig! " : "❌ "}
                  {q.explanation}
                </p>
              )}
            </fieldset>
          ))}

          {!checked ? (
            <button
              onClick={check}
              disabled={!allAnswered}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Check answers
            </button>
          ) : (
            <div className="space-y-2" role="status">
              <p className="font-semibold">
                {correct}/{story.questions.length} correct ·{" "}
                {correct === story.questions.length
                  ? "Perfekt! 🎉"
                  : correct >= story.questions.length / 2
                    ? "Gut gemacht!"
                    : "Read it once more!"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAnswers({}); setChecked(false); }}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                >
                  Try again
                </button>
                <Link
                  href="/stories"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                >
                  More stories
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
