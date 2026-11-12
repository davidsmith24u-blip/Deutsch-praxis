import "server-only";
import { createClient } from "@/lib/supabase/server";

function todayStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Updates the user's streak + adds XP. Called when the user is active.
 * - First activity today: streak +1 (or reset to 1 if they missed a day)
 * - Adds xp to the running total.
 */
export async function touchStreak(userId: string, xpGain = 0): Promise<{ streak: number; xp: number }> {
  const supabase = await createClient();
  const { data: progress } = await supabase
    .from("user_progress")
    .select("xp, streak, last_activity_date")
    .eq("user_id", userId)
    .single();

  const today = todayStr();
  const last = progress?.last_activity_date ?? null;

  let streak = progress?.streak ?? 0;
  let xp = progress?.xp ?? 0;

  if (last !== today) {
    streak = last === todayStr(-1) ? streak + 1 : 1;
  }
  xp += xpGain;

  await supabase.from("user_progress").upsert({
    user_id: userId,
    xp,
    streak,
    last_activity_date: today,
    updated_at: new Date().toISOString(),
  });

  return { streak, xp };
}

/** Daily goal: count of exercises completed today. */
export async function exercisesDoneToday(userId: string): Promise<number> {
  const supabase = await createClient();
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("exercise_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("updated_at", start.toISOString());
  return count ?? 0;
}
