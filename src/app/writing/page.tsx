export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

interface Submission {
  id: string;
  level: string;
  task: string;
  text: string;
  score: number;
  feedback: string | null;
  correction: string | null;
  created_at: string;
}

function ScoreChart({ points }: { points: Array<{ score: number; date: string }> }) {
  if (points.length === 0) return null;
  const W = 560, H = 180, PAD = 24;
  const min = Math.min(...points.map((p) => p.score)) - 5;
  const max = Math.max(...points.map((p) => p.score)) + 5;
  const lo = Math.max(0, min), hi = Math.min(100, max);
  const x = (i: number) => PAD + (i / Math.max(1, points.length - 1)) * (W - PAD * 2);
  const y = (s: number) => H - PAD - ((s - lo) / Math.max(1, hi - lo)) * (H - PAD * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.score).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Writing score trend">
      <line x1={PAD} y1={y(60)} x2={W - PAD} y2={y(60)} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1" />
      <text x={W - PAD + 4} y={y(60) + 3} fontSize="9" fill="#f59e0b">pass</text>
      <path d={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.score)} r="4" fill="#4f46e5" />
          <title>{`${p.date}: ${p.score}/100`}</title>
        </g>
      ))}
      {points.map((p, i) => (
        <text key={`t${i}`} x={x(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#64748b">
          {p.date}
        </text>
      ))}
    </svg>
  );
}

export default async function WritingCoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("writing_submissions")
    .select("id, level, task, text, score, feedback, correction, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const submissions = (data ?? []) as Submission[];
  const chrono = [...submissions].reverse();
  const first = chrono[0]?.score ?? 0;
  const last = chrono[chrono.length - 1]?.score ?? 0;
  const delta = chrono.length >= 2 ? last - first : 0;
  const avg = chrono.length ? Math.round(chrono.reduce((a, s) => a + s.score, 0) / chrono.length) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Writing Coach</h1>
        <p className="text-muted-foreground">
          Every Schreiben submission is scored and tracked.{" "}
          <Link href="/units" className="text-primary underline">Practise a writing task →</Link>
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-muted-foreground">No submissions yet. Complete a writing exercise in any unit and your score history will appear here.</p>
            <p className="text-xs text-muted-foreground">(Requires migration 0004_writing_submissions.sql to be run.)</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4 text-center">
            <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{submissions.length}</p><p className="text-xs text-muted-foreground">submissions</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{avg}</p><p className="text-xs text-muted-foreground">average score</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className={`text-2xl font-bold ${delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{delta >= 0 ? "+" : ""}{delta}</p><p className="text-xs text-muted-foreground">since first try</p></CardContent></Card>
            <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{last}</p><p className="text-xs text-muted-foreground">latest score</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score trend</CardTitle>
              <CardDescription>Orange line = 60-point pass mark</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreChart points={chrono.map((s) => ({ score: Number(s.score), date: new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) }))} />
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Submissions</h2>
            {submissions.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${Number(s.score) >= 70 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"}`}>
                      {Number(s.score)}/100
                    </span>
                    <span className="text-xs text-muted-foreground">{s.level} · {new Date(s.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-medium">{s.task}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">„{s.text}"</p>
                  {s.feedback && <p className="text-sm">{s.feedback}</p>}
                  {s.correction && (
                    <p className="rounded-md bg-emerald-50 p-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      ✍️ {s.correction}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
