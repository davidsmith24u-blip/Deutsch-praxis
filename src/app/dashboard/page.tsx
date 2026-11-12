export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LEVELS, LESSONS, lessonsByLevel } from "@/data/curriculum";
import Link from "next/link";

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current level</CardTitle>
            <CardDescription>{LEVELS.find((l) => l.code === level)?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>XP & Streak</CardTitle>
            <CardDescription>Keep the momentum going</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{progress?.xp ?? 0} XP</p>
            <p className="text-muted-foreground">{progress?.streak ?? 0} day streak</p>
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
            <Link href="/interview" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Start interview</Link>
            <Link href="/progress" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">View progress</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}