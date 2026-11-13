import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface Quest {
  id: string;
  icon: string;
  title: string;
  description: string;
  target: number;
  count: number;
  xp: number;
}

function weekStart(now = new Date()): Date {
  // Monday 00:00 local
  const d = new Date(now);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Computes the user's weekly quests from activity since Monday 00:00. */
export async function getWeeklyQuests(userId: string): Promise<{ quests: Quest[]; weekStartIso: string }> {
  const supabase = await createClient();
  const start = weekStart();
  const startIso = start.toISOString();

  const [ex, srs, iv, exams] = await Promise.all([
    supabase
      .from("exercise_progress")
      .select("exercise_id, updated_at")
      .eq("user_id", userId)
      .gte("updated_at", startIso),
    supabase
      .from("srs_cards")
      .select("id, last_reviewed_at")
      .eq("user_id", userId)
      .gte("last_reviewed_at", startIso),
    supabase
      .from("interview_sessions")
      .select("id, started_at, ended_at")
      .eq("user_id", userId)
      .gte("started_at", startIso),
    supabase
      .from("exam_results")
      .select("id, created_at")
      .eq("user_id", userId)
      .gte("created_at", startIso),
  ]);

  const exercises = new Set<string>();
  for (const r of ex.data ?? []) exercises.add((r as any).exercise_id);

  const quests: Quest[] = [
    {
      id: "exercises",
      icon: "📚",
      title: "Sharpshooter",
      description: "Complete 10 exercises in any skill",
      target: 10,
      count: exercises.size,
      xp: 50,
    },
    {
      id: "reviews",
      icon: "🔁",
      title: "Memory keeper",
      description: "Review 15 flashcards",
      target: 15,
      count: (srs.data ?? []).length,
      xp: 50,
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Small talk champion",
      description: "Finish 1 voice interview",
      target: 1,
      count: (iv.data ?? []).filter((r: any) => r.ended_at).length,
      xp: 50,
    },
    {
      id: "exam",
      icon: "📝",
      title: "Exam courage",
      description: "Take 1 exam (quick or mock)",
      target: 1,
      count: (exams.data ?? []).length,
      xp: 50,
    },
  ];

  return { quests, weekStartIso: startIso };
}
