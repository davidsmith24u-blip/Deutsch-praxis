export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Row { id: string; display_name: string; xp: number; streak: number }

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let rows: Row[] = [];
  try {
    const { data } = await supabase.from("leaderboard_view").select("id, display_name, xp, streak");
    rows = (data ?? []) as Row[];
  } catch {
    rows = [];
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-8 text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-white/90">Top learners by XP — keep practising to climb!</p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No leaderboard data yet. Make sure migration <code>0003_srs_exams.sql</code> created the <code>leaderboard_view</code>.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top 50</CardTitle>
            <CardDescription>Emails are hidden — only you see your own name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {rows.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${user && r.id === user.id ? "border-primary bg-accent" : ""}`}
              >
                <span className="w-8 text-center font-semibold">{medals[i] ?? i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {user && r.id === user.id ? "You" : r.display_name}
                </span>
                <span className="text-sm text-orange-500">🔥 {r.streak}</span>
                <span className="w-20 text-right text-sm font-semibold">{r.xp} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
