"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LEVELS } from "@/data/curriculum";
import { REAL_SCENARIOS, realScenariosByLevel } from "@/data/realScenarios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InterviewPage() {
  const router = useRouter();
  const [level, setLevel] = useState("A1");
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("current_level").eq("id", user.id).single();
        if (profile?.current_level) setLevel(profile.current_level);
      }
    };
    load();
  }, []);

  const start = async (scenarioId: string, lvl: string) => {
    setStarting(scenarioId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let sessionId: string | null = null;
    if (user) {
      const { data } = await supabase
        .from("interview_sessions")
        .insert({ user_id: user.id, level_code: lvl, scenario_key: scenarioId })
        .select("id")
        .single();
      sessionId = data?.id ?? null;
    }
    if (!sessionId) {
      // local-only session id
      sessionId = `local-${Date.now()}`;
    }
    router.push(`/interview/${sessionId}?scenario=${scenarioId}&level=${lvl}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Voice Interview Practice</h1>
        <p className="text-muted-foreground">Practice speaking with an AI interviewer adapted to your level.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLevel(l.code)}
            className={`rounded-full border px-4 py-1 text-sm ${level === l.code ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}
          >
            {l.code}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {realScenariosByLevel(level).map((s) => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <Badge>{s.levels.join("/")}</Badge>
              </div>
              <CardDescription>{s.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full"
                disabled={starting === s.id}
                onClick={() => start(s.id, level)}
              >
                {starting === s.id ? "Starting..." : "Start practice"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}