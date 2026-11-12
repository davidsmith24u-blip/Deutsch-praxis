"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UNITS } from "@/data/units";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function PlanClient({ currentLevel }: { currentLevel: string }) {
  const [from, setFrom] = useState(currentLevel in LEVELS ? currentLevel : "A1");
  const [to, setTo] = useState("B1");
  const [hours, setHours] = useState(5);

  const plan = useMemo(() => {
    const fi = LEVEL_ORDER.indexOf(from);
    const ti = LEVEL_ORDER.indexOf(to);
    if (ti < fi) return { weeks: 0, rows: [], error: "Target level must be at or above your current level." };

    const relevant = UNITS.filter((u) => {
      const ui = LEVEL_ORDER.indexOf(u.level);
      return ui >= fi && ui <= ti;
    }).sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) || a.order - b.order);

    const totalExercises = relevant.reduce((a, u) => a + u.exercises.length, 0);
    const weeks = Math.max(1, Math.ceil(relevant.length / Math.max(1, Math.round(hours))));
    const rows = relevant.map((u, i) => ({
      ...u,
      week: Math.min(weeks, Math.floor(i / Math.max(1, Math.round(hours))) + 1),
    }));
    return { weeks, rows, error: null as string | null, totalExercises };
  }, [from, to, hours]);

  const weeks = plan.weeks || 0;
  const byWeek = new Map<number, typeof plan.rows>();
  for (const r of plan.rows) {
    const list = byWeek.get(r.week) ?? [];
    list.push(r);
    byWeek.set(r.week, list);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Current level</span>
          <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={from} onChange={(e) => setFrom(e.target.value)}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Target level</span>
          <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={to} onChange={(e) => setTo(e.target.value)}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Units per week: {Math.round(hours)}</span>
          <input type="range" min={1} max={8} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </label>
      </div>

      {plan.error ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">{plan.error}</CardContent></Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{from} → {to} in {weeks} week{weeks === 1 ? "" : "s"}</CardTitle>
              <CardDescription>
                {plan.rows.length} units · {plan.totalExercises} exercises · plus 2 voice interviews and 1 mock exam per week
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="space-y-4">
            {Array.from({ length: weeks }, (_, w) => w + 1).map((week) => (
              <Card key={week}>
                <CardHeader>
                  <CardTitle className="text-base">Week {week}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(byWeek.get(week) ?? []).map((u) => (
                    <Link key={u.id} href={`/units/${u.id}`} className="rounded-xl border p-3 hover:border-primary/60">
                      <p className="text-xs font-semibold text-primary">{u.level}</p>
                      <p className="text-sm font-medium">{u.title}</p>
                      <p className="text-xs text-muted-foreground">{u.exercises.length} exercises</p>
                    </Link>
                  ))}
                  <div className="rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
                    🎙 2× voice interviews · 🎓 1× {week % 2 === 0 ? `mock exam` : "quick exam"} · 📚 daily review
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/mock/a1" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
              Try a mock exam to check your level
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
