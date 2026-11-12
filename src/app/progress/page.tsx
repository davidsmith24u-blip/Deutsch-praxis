export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// LEVELS not needed here

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single();
  const { data: sessions } = await supabase.from("interview_sessions").select("id, level_code, started_at, ended_at").eq("user_id", user.id).order("started_at", { ascending: false });
  const { data: lp } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id);

  const completedLessons = (lp ?? []).filter((r: any) => r.completed).length;
  const totalLessons = 16; // from curriculum seed count
  const pct = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="text-muted-foreground">Track your learning journey.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Estimated level</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{progress?.estimated_level ?? "A1"}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>XP</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{progress?.xp ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Streak</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{progress?.streak ?? 0} days</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
          <CardDescription>{completedLessons} of {totalLessons} completed</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={pct} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview sessions</CardTitle>
          <CardDescription>{sessions?.length ?? 0} sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(sessions ?? []).slice(0, 10).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span>{s.level_code}</span>
                <span className="text-muted-foreground">{new Date(s.started_at).toLocaleString()}</span>
              </div>
            ))}
            {(!sessions || sessions.length === 0) && <p className="text-muted-foreground">No sessions yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}