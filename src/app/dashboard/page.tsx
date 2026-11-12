export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LESSONS, lessonsByLevel } from "@/data/curriculum";
import { exercisesDoneToday } from "@/lib/streak";
import { computeBadges } from "@/lib/badges";
import Link from "next/link";

const DAILY_GOAL = 10;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single();
  const { data: lp } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id);

  const level = (profile?.current_level ?? progress?.estimated_level ?? "A1") as any;
  // local lessons don't have db ids; count completed rows for now
  const totalLessons = LESSONS.length;
  const completedCount = (lp ?? []).filter((r: any) => r.completed).length;
  const pct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const nextLesson = lessonsByLevel(level)[0];

  const [doneToday, badges] = await Promise.all([
    exercisesDoneToday(user.id),
    computeBadges(user.id, level, progress?.streak ?? 0),
  ]);
  const goalPct = Math.min(100, Math.round((doneToday / DAILY_GOAL) * 100));
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Willkommen zurück 👋</h1>
        <p className="mt-1 text-white/90">{user.email}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">Level {level}</span>
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">{progress?.xp ?? 0} XP</span>
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">{progress?.streak ?? 0}-day streak 🔥</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Daily goal</CardTitle>
            <CardDescription>{doneToday} of {DAILY_GOAL} exercises today</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={goalPct} />
            <p className="mt-2 text-sm text-muted-foreground">
              {goalPct >= 100 ? "Goal reached — großartig! 🎉" : `${DAILY_GOAL - doneToday} more to keep your streak`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review due</CardTitle>
            <CardDescription>Spaced repetition keeps words alive</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/review" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Start review session
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>{completedCount} of {totalLessons} lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={pct} />
            <p className="mt-2 text-sm text-muted-foreground">{pct}% complete</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>{earnedBadges.length} of {badges.length} earned</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {badges.map((b) => (
            <div
              key={b.id}
              title={b.description}
              aria-label={`${b.title}${b.earned ? " (earned)" : " (locked)"}`}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center ${b.earned ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40" : "opacity-40"}`}
            >
              <span className="text-2xl" aria-hidden="true">{b.emoji}</span>
              <span className="text-[10px] leading-tight font-medium">{b.title}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next recommended activity</CardTitle>
          <CardDescription>Continue your {level} journey</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{nextLesson?.title ?? "Voice practice"}</p>
            <p className="text-sm text-muted-foreground">{nextLesson?.summary}</p>
          </div>
          <div className="flex gap-2">
            {nextLesson && (
              <Link href={`/lessons/${nextLesson.slug}`} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Open lesson
              </Link>
            )}
            <Link href="/interview" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              Voice practice
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/curriculum" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Browse curriculum</Link>
            <Link href="/units" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Units</Link>
            <Link href="/interview" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Start interview</Link>
            <Link href="/exam" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Exam mode</Link>
            <Link href="/progress" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">View progress</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}