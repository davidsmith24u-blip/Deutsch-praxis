"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LEVELS } from "@/data/curriculum";

const GOALS = [
  "Travel & everyday life",
  "Work / professional German",
  "Studies / university",
  "Family & friends",
  "Exam preparation (Goethe)",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [level, setLevel] = useState("A1");
  const [goal, setGoal] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({ id: user.id, email: user.email, current_level: level, learning_goal: goal });
      await supabase.from("user_progress").upsert({ user_id: user.id, estimated_level: level });
    }
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Welcome! Let's personalize your path</CardTitle>
          <CardDescription>Choose your current level and goal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 font-medium">Current level</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LEVELS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLevel(l.code)}
                  className={`rounded-md border p-3 text-sm ${level === l.code ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">Learning goal</p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`rounded-full border px-3 py-1 text-sm ${goal === g ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={save} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}