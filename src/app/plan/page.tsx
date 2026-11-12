import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlanClient from "@/components/plan-client";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("current_level").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your learning plan</h1>
        <p className="text-muted-foreground">Pick a target and pace — we build a week-by-week roadmap through the units.</p>
      </div>
      <PlanClient currentLevel={profile?.current_level ?? "A1"} />
    </div>
  );
}
