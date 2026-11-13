"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Quest } from "@/lib/quests";

export default function QuestsClient({ quests, weekLabel }: { quests: Quest[]; weekLabel: string }) {
  const [claimed, setClaimed] = useState<Record<string, boolean>>(() => {
    try {
      const raw = window.localStorage.getItem("dp-quests-claimed");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [message, setMessage] = useState<string | null>(null);

  const claim = async (q: Quest) => {
    if (q.count < q.target || claimed[q.id]) return;
    setClaimed((prev) => {
      const next = { ...prev, [q.id]: true };
      try {
        window.localStorage.setItem("dp-quests-claimed", JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
    setMessage(`+${q.xp} XP added to your streak! 🎉`);
    try {
      await fetch("/api/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpGain: q.xp }),
      });
    } catch {
      // XP already shown as claimed
    }
  };

  const reset = () => {
    setClaimed({});
    try {
      window.localStorage.removeItem("dp-quests-claimed");
    } catch {
      // storage unavailable
    }
    setMessage("New week, new quests — claims reset.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{weekLabel}</p>
        <button onClick={reset} className="text-xs text-muted-foreground underline hover:text-primary">
          Reset claims (new week)
        </button>
      </div>
      {message && (
        <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {quests.map((q) => {
          const done = q.count >= q.target;
          const isClaimed = claimed[q.id];
          const pct = Math.min(100, Math.round((q.count / q.target) * 100));
          return (
            <Card key={q.id} className={done && !isClaimed ? "border-amber-400/70" : undefined}>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span aria-hidden="true">{q.icon}</span> {q.title}
                  {isClaimed && <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400">claimed ✓</span>}
                </CardTitle>
                <CardDescription>{q.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${q.count} of ${q.target}`}>
                  <Progress value={pct} />
                </div>
                <p className="text-sm text-muted-foreground">{q.count}/{q.target} · reward {q.xp} XP</p>
                {done && !isClaimed ? (
                  <button
                    onClick={() => claim(q)}
                    className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Claim {q.xp} XP
                  </button>
                ) : !done ? (
                  <p className="text-xs text-muted-foreground">
                    Keep going — try{" "}
                    <Link href="/units" className="underline">units</Link>,{" "}
                    <Link href="/review" className="underline">review</Link>,{" "}
                    <Link href="/interview" className="underline">voice practice</Link> or{" "}
                    <Link href="/exam" className="underline">exams</Link>.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
