import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SKILLS = [
  { code: "lesen", label: "Lesen", icon: "📖", color: "#4f46e5" },
  { code: "hoeren", label: "Hören", icon: "🎧", color: "#0891b2" },
  { code: "schreiben", label: "Schreiben", icon: "✍️", color: "#059669" },
  { code: "sprechen", label: "Sprechen", icon: "🎤", color: "#d97706" },
];

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <h1 className="text-3xl font-bold">Skill analytics</h1>
        <p className="text-muted-foreground">Log in to see your progress analytics.</p>
        <Link href="/login" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
          Log in
        </Link>
      </div>
    );
  }

  // Aggregate exercise_progress by skill
  const { data: rows } = await supabase
    .from("exercise_progress")
    .select("skill, completed, score, updated_at")
    .eq("user_id", user.id);

  const bySkill: Record<string, { done: number; total: number; scoreSum: number; scoreCount: number }> = {};
  for (const s of SKILLS) bySkill[s.code] = { done: 0, total: 0, scoreSum: 0, scoreCount: 0 };
  for (const r of rows ?? []) {
    const sk = (r as any).skill;
    if (!bySkill[sk]) bySkill[sk] = { done: 0, total: 0, scoreSum: 0, scoreCount: 0 };
    bySkill[sk].total += 1;
    if ((r as any).completed) bySkill[sk].done += 1;
    if (typeof (r as any).score === "number") {
      bySkill[sk].scoreSum += (r as any).score;
      bySkill[sk].scoreCount += 1;
    }
  }

  // Weekly activity: exercises per day last 7 days
  const now = new Date();
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = (rows ?? []).filter((r: any) => {
      const t = new Date(r.updated_at);
      return t >= d && t < next;
    }).length;
    days.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      count,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  // Weakest skill
  const skillStats = SKILLS.map((s) => {
    const b = bySkill[s.code];
    const avg = b.scoreCount ? Math.round(b.scoreSum / b.scoreCount) : 0;
    const acc = b.total ? Math.round((b.done / b.total) * 100) : 0;
    return { ...s, ...b, avg, acc };
  });
  const weakest = [...skillStats]
    .filter((s) => s.total > 0)
    .sort((a, b) => a.acc - b.acc)[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Skill analytics 📊</h1>
        <p className="text-muted-foreground">
          See where you're strong and where to focus next.
        </p>
      </div>

      {/* Radar-ish skill bars */}
      <Card>
        <CardHeader>
          <CardTitle>Skill breakdown</CardTitle>
          <CardDescription>Completion rate and average score per skill</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {skillStats.map((s) => (
            <div key={s.code} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  <span aria-hidden="true">{s.icon}</span> {s.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.done}/{s.total} done · avg {s.avg}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${s.acc}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly activity bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 days</CardTitle>
          <CardDescription>Exercises completed per day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-32">
            {days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary transition-all"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                  title={`${d.count} exercises`}
                />
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      {weakest && (
        <Card className="border-amber-400/60">
          <CardHeader>
            <CardTitle className="text-lg">🎯 Focus recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your weakest skill so far is <strong>{weakest.label}</strong> ({weakest.acc}% completion).
              Try 2–3 exercises there today to balance your skills.
            </p>
            <Link
              href="/units"
              className="mt-3 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Practice {weakest.label}
            </Link>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="text-primary underline">← Back to dashboard</Link>
      </p>
    </div>
  );
}
