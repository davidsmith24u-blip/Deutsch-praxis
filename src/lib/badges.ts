import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earned: boolean;
}

interface BadgeStats {
  exercisesCompleted: number;
  streak: number;
  cardsReviewed: number; // total reps across cards
  examsPassed: number;
  level: string;
}

async function getBadgeStats(userId: string, level: string, streak: number): Promise<BadgeStats> {
  const supabase = await createClient();
  const [exercises, cards, exams] = await Promise.all([
    supabase.from("exercise_progress").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("completed", true),
    supabase.from("srs_cards").select("reps").eq("user_id", userId),
    supabase.from("exam_results").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("passed", true),
  ]);
  return {
    exercisesCompleted: exercises.count ?? 0,
    streak,
    cardsReviewed: (cards.data ?? []).reduce((acc: number, r: any) => acc + (r.reps ?? 0), 0),
    examsPassed: exams.count ?? 0,
    level,
  };
}

export async function computeBadges(userId: string, level: string, streak: number): Promise<BadgeDef[]> {
  const s = await getBadgeStats(userId, level, streak);
  return [
    { id: "first-steps", title: "First Steps", description: "Complete your first exercise", emoji: "🌱", earned: s.exercisesCompleted >= 1 },
    { id: "getting-going", title: "Getting Going", description: "Complete 10 exercises", emoji: "🚶", earned: s.exercisesCompleted >= 10 },
    { id: "marathon", title: "Marathoner", description: "Complete 50 exercises", emoji: "🏃", earned: s.exercisesCompleted >= 50 },
    { id: "streak-3", title: "On Fire", description: "3-day learning streak", emoji: "🔥", earned: s.streak >= 3 },
    { id: "streak-7", title: "Unstoppable", description: "7-day learning streak", emoji: "⚡", earned: s.streak >= 7 },
    { id: "reviewer", title: "Word Collector", description: "20 spaced-repetition reviews", emoji: "📚", earned: s.cardsReviewed >= 20 },
    { id: "exam-passer", title: "Exam Ready", description: "Pass a practice exam", emoji: "🎓", earned: s.examsPassed >= 1 },
    { id: "level-up", title: "Level Up", description: "Reach A2 or higher", emoji: "📈", earned: ["A2", "B1", "B2", "C1", "C2"].includes(s.level) },
  ];
}
