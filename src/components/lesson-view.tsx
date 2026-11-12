"use client";

import { useState } from "react";
import { Lesson } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react";

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const check = (id: string, answer: string) => {
    setChecked((prev) => ({ ...prev, [id]: answer.trim().toLowerCase() === (lesson.exercises.find((e) => e.id === id)?.answer ?? "").trim().toLowerCase() }));
  };

  const markComplete = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // lesson_progress uses lesson_id uuid; we don't have db id. Store slug in a separate? For now award XP via user_progress.
    const { data: cur } = await supabase.from("user_progress").select("xp").eq("user_id", user.id).single();
    await supabase.from("user_progress").upsert({ user_id: user.id, xp: (cur?.xp ?? 0) + 10, estimated_level: lesson.level });
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div>
        <Badge>{lesson.level}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.summary}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Grammar</h2>
        {lesson.grammar.map((g, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">{g.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>{g.explanation}</p>
              <div className="space-y-1">
                {g.examples.map((ex, j) => (
                  <div key={j} className="rounded-md bg-muted p-2 text-sm">
                    <p className="font-medium">{ex.de}</p>
                    <p className="text-muted-foreground">{ex.en}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Vocabulary</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {lesson.vocabulary.map((v, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="font-semibold">{v.word}</p>
                <p className="text-sm text-muted-foreground">{v.translation}</p>
                {v.example && <p className="mt-1 text-xs italic">{v.example}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        {lesson.exercises.map((ex) => (
          <Card key={ex.id}>
            <CardContent className="p-4 space-y-3">
              <p className="font-medium">{ex.prompt}</p>
              {ex.type === "mcq" && ex.options && (
                <div className="flex flex-wrap gap-2">
                  {ex.options.map((opt) => (
                    <Button
                      key={opt}
                      variant={answers[ex.id] === opt ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setAnswers((a) => ({ ...a, [ex.id]: opt })); check(ex.id, opt); }}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
              {(ex.type === "fill" || ex.type === "build") && (
                <div className="flex gap-2">
                  <Input
                    value={answers[ex.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))}
                    placeholder={ex.hint ?? "Your answer"}
                  />
                  <Button size="sm" onClick={() => check(ex.id, answers[ex.id] ?? "")}>Check</Button>
                </div>
              )}
              {checked[ex.id] !== undefined && (
                <div className={`flex items-center gap-2 text-sm ${checked[ex.id] ? "text-green-600" : "text-red-600"}`}>
                  {checked[ex.id] ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {checked[ex.id] ? "Correct!" : `Answer: ${ex.answer}`}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={markComplete}>Mark lesson complete</Button>
        {saved && <span className="text-sm text-green-600">Saved! +10 XP</span>}
      </div>
    </div>
  );
}