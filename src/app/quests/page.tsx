import { createClient } from "@/lib/supabase/server";
import { getWeeklyQuests } from "@/lib/quests";
import QuestsClient from "@/components/quests-client";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Weekly quests</h1>
        <p className="text-muted-foreground">
          Log in to get your personal missions — four quests every week, +50 XP each.
        </p>
      </div>
    );
  }

  const { quests } = await getWeeklyQuests(user.id);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const weekLabel = `Week of ${fmt(monday)} – ${fmt(sunday)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Weekly quests 🎯</h1>
        <p className="text-muted-foreground">
          Fresh missions every Monday. Complete them for bonus XP on top of your streak.
        </p>
      </div>
      <QuestsClient quests={quests} weekLabel={weekLabel} />
    </div>
  );
}
