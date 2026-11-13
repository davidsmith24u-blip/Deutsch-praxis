import { UNITS } from "@/data/units";
import { fetchCustomUnits } from "@/lib/custom-units";
import { createClient } from "@/lib/supabase/server";
import UnitsClient, { type UnitProgress } from "@/components/units-client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  const custom = await fetchCustomUnits();
  const all = [...UNITS, ...custom];

  // per-unit progress for the logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const progress: Record<string, UnitProgress> = {};
  if (user) {
    const { data: rows } = await supabase
      .from("exercise_progress")
      .select("unit_id, completed")
      .eq("user_id", user.id);
    for (const r of rows ?? []) {
      const entry = progress[(r as any).unit_id] ?? { done: 0, total: 0 };
      const total = all.find((u) => u.id === (r as any).unit_id)?.exercises.length ?? 0;
      entry.total = total;
      if ((r as any).completed) entry.done += 1;
      progress[(r as any).unit_id] = entry;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Units</h1>
        <p className="text-muted-foreground">
          Goethe-style practice across all four skills — {all.length} units, A1 to C2.{" "}
          <Link href="/roadmap" className="text-primary underline">See the level roadmap →</Link>
        </p>
      </div>
      <UnitsClient units={all} progress={progress} />
    </div>
  );
}
