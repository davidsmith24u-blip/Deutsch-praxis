import Link from "next/link";
import { UNITS, LEVELS, type LevelCode } from "@/data/units";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const LEVEL_TITLES: Record<string, string> = Object.fromEntries(
  LEVELS.map((l) => [l.code, l.title])
) as Record<string, string>;

export default async function RoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const doneByUnit = new Map<string, number>();
  if (user) {
    const { data: rows } = await supabase
      .from("exercise_progress")
      .select("unit_id, completed")
      .eq("user_id", user.id);
    for (const r of rows ?? []) {
      if ((r as any).completed) {
        doneByUnit.set((r as any).unit_id, (doneByUnit.get((r as any).unit_id) ?? 0) + 1);
      }
    }
  }

  const levels = LEVELS.map((l) => l.code) as LevelCode[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your roadmap</h1>
        <p className="text-muted-foreground">
          Six levels, {UNITS.length} units — from first words to near-native mastery. Finish a
          unit&apos;s exercises to unlock the next.
        </p>
      </div>

      {levels.map((lvl, li) => {
        const units = UNITS.filter((u) => u.level === lvl).sort((a, b) => a.order - b.order);
        const levelDone = units.filter(
          (u) => (doneByUnit.get(u.id) ?? 0) >= u.exercises.length && u.exercises.length > 0
        ).length;
        const levelPct = Math.round((levelDone / units.length) * 100);
        return (
          <section key={lvl} className="relative">
            {/* connector line */}
            {li < levels.length - 1 && (
              <div aria-hidden="true" className="absolute left-5 top-14 h-[calc(100%-2rem)] w-px border-l-2 border-dashed border-muted-foreground/20" />
            )}
            <div className="relative flex items-center gap-4">
              <span
                className={`z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  levelDone > 0
                    ? "bg-emerald-600 text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {lvl}
              </span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{LEVEL_TITLES[lvl] ?? lvl}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Progress value={levelPct} className="max-w-[12rem]" />
                  <span className="text-xs text-muted-foreground">{levelDone}/{units.length} units</span>
                </div>
              </div>
            </div>

            <ol className="mt-4 space-y-2 md:ml-14">
              {units.map((u, ui) => {
                const done = doneByUnit.get(u.id) ?? 0;
                const unitPct = Math.min(100, Math.round((done / Math.max(1, u.exercises.length)) * 100));
                const prevDone = ui === 0 ? true : (() => {
                  const prev = units[ui - 1];
                  return (doneByUnit.get(prev.id) ?? 0) >= Math.ceil(prev.exercises.length * ((prev.unlockThreshold ?? 100) / 100));
                })();
                const unlocked = ui === 0 ? true : prevDone || done > 0;
                const complete = done >= u.exercises.length && u.exercises.length > 0;

                return (
                  <li key={u.id}>
                    {unlocked ? (
                      <Link
                        href={`/units/${u.id}`}
                        className={`flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50 ${complete ? "border-emerald-500/50" : ""}`}
                      >
                        {complete ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Complete" />
                        ) : (
                          <span
                            className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold"
                            aria-hidden="true"
                          >
                            {ui + 1}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{u.title.replace(/^Unit \d+:\s*/, "")}</span>
                          <span className="block text-xs text-muted-foreground">{u.objective}</span>
                        </span>
                        <span className="w-20 shrink-0">
                          <Progress value={unitPct} />
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border bg-card/50 p-3 opacity-60">
                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="Locked" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{u.title.replace(/^Unit \d+:\s*/, "")}</span>
                          <span className="block text-xs text-muted-foreground">Finish the previous unit to unlock</span>
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>Track your progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Log in to save progress
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
