import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

const TIERS = [
  { name: "Bronze", min: 0, emoji: "🥉", color: "#cd7f32" },
  { name: "Silver", min: 51, emoji: "🥈", color: "#c0c0c0" },
  { name: "Gold", min: 151, emoji: "🥇", color: "#ffd700" },
  { name: "Platinum", min: 301, emoji: "💎", color: "#e5e4e2" },
  { name: "Diamond", min: 601, emoji: "💠", color: "#b9f2ff" },
];

function weekStart(now = new Date()): Date {
  const d = new Date(now);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function LeaguesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let weeklyXp = 0;
  let streak = 0;
  if (user) {
    const start = weekStart().toISOString();
    const [{ data: ex }, { data: prog }] = await Promise.all([
      supabase
        .from("exercise_progress")
        .select("updated_at")
        .eq("user_id", user.id)
        .gte("updated_at", start),
      supabase.from("user_progress").select("streak, xp").eq("user_id", user.id).single(),
    ]);
    weeklyXp = (ex?.length ?? 0) * 10;
    streak = (prog as any)?.streak ?? 0;
  }

  // tier
  let tierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (weeklyXp >= TIERS[i].min) {
      tierIndex = i;
      break;
    }
  }
  const tier = TIERS[tierIndex];
  const nextTier = TIERS[tierIndex + 1];
  const progressToNext = nextTier
    ? Math.min(100, Math.round(((weeklyXp - tier.min) / (nextTier.min - tier.min)) * 100))
    : 100;

  const monday = weekStart();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Leagues 🏆</h1>
        <p className="text-muted-foreground">
          Earn XP this week to climb the tiers. Resets every Monday.
        </p>
      </div>

      <Card
        className="overflow-hidden"
        style={{ borderColor: tier.color, borderWidth: 2 }}
      >
        <CardHeader className="text-center">
          <div className="text-6xl" aria-hidden="true">{tier.emoji}</div>
          <CardTitle className="text-2xl mt-2">{tier.name} League</CardTitle>
          <CardDescription>
            Week of {fmt(monday)} – {fmt(sunday)} · {weeklyXp} XP this week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextTier ? (
            <>
              <Progress value={progressToNext} />
              <p className="text-sm text-muted-foreground text-center">
                {nextTier.min - weeklyXp} XP to reach {nextTier.emoji} {nextTier.name}
              </p>
            </>
          ) : (
            <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
              You've reached the top tier — Diamond! 💠
            </p>
          )}
          {user && (
            <p className="text-center text-xs text-muted-foreground">
              {streak}-day streak 🔥 · keep practicing to climb
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All tiers</CardTitle>
          <CardDescription>XP thresholds per week</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {TIERS.map((t, i) => (
              <li
                key={t.name}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  t.name === tier.name ? "border-primary bg-primary/5" : ""
                }`}
              >
                <span className="font-medium">
                  <span aria-hidden="true">{t.emoji}</span> {t.name}
                </span>
                <span className="text-muted-foreground">
                  {t.min}+ XP{TIERS[i + 1] ? ` (up to ${TIERS[i + 1].min - 1})` : ""}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to climb</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>📚 Complete exercises (+10 XP each)</li>
            <li>🔁 Review flashcards (+2 XP each)</li>
            <li>🎤 Finish voice interviews (+XP via tutor)</li>
            <li>📝 Pass exams (+50 XP bonus per quest)</li>
            <li>🎯 Complete weekly quests for bonus XP</li>
          </ul>
          {!user && (
            <Link href="/login" className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              Log in to join a league
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
