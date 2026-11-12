"use client";

import { useState, useEffect } from "react";
import { UNITS } from "@/data/units";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function ExamPage() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [finished, setFinished] = useState(false);
  const [levelFilter, setLevelFilter] = useState<"Mixed" | "A1" | "A2" | "B1" | "B2">("Mixed");

  const poolFor = (lvl: string) =>
    UNITS.filter((u) => lvl === "Mixed" || u.level === lvl)
      .flatMap((u) => u.exercises)
      .filter((e) => e.type === "mcq" || e.type === "truefalse" || e.type === "gapfill");

  const start = (lvl: string = levelFilter) => {
    const pool = poolFor(lvl);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setIndex(0);
    setAnswers({});
    setTimeLeft(300);
    setFinished(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  if (!started) {
    const levelOptions: Array<"Mixed" | "A1" | "A2" | "B1" | "B2"> = ["Mixed", "A1", "A2", "B1", "B2"];
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-center text-white shadow-lg">
          <h1 className="text-3xl font-bold">Goethe-style Exam Mode</h1>
          <p className="mt-2 text-white/90">Timed practice with realistic task formats. 5 minutes, 8 questions.</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-center text-sm font-medium text-muted-foreground">Choose your level</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {levelOptions.map((l) => {
              const count = poolFor(l).length;
              return (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  aria-pressed={levelFilter === l}
                  className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                    levelFilter === l
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent"
                  } ${count === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {l} <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-center">
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">8</p><p className="text-sm text-muted-foreground">Questions</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">5:00</p><p className="text-sm text-muted-foreground">Time limit</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{levelFilter}</p><p className="text-sm text-muted-foreground">Level</p></CardContent></Card>
        </div>
        <div className="text-center">
          <Button size="lg" onClick={() => start(levelFilter)} disabled={poolFor(levelFilter).length === 0}>Start exam</Button>
        </div>
      </div>
    );
  }

  if (finished) {
    const results = questions.map((q, i) => ({ q, given: answers[i] ?? "", ok: (answers[i] ?? "").trim().toLowerCase() === (q.answer ?? "").trim().toLowerCase() }));
    const score = results.filter((r) => r.ok).length;
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div className={`overflow-hidden rounded-3xl p-10 text-center text-white shadow-lg ${pct >= 60 ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
          <p className="text-5xl font-bold">{score} / {questions.length}</p>
          <p className="mt-2 text-white/90">{pct >= 60 ? "Passed — gut gemacht!" : "Keep practising — you'll get there."}</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Review</h2>
          {results.map((r, i) => (
            <Card key={i}>
              <CardContent className="space-y-1 pt-4">
                <p className="text-sm font-medium">{r.q.prompt}</p>
                <p className={r.ok ? "text-sm text-emerald-600 dark:text-emerald-400" : "text-sm text-red-600 dark:text-red-400"}>
                  Your answer: {r.given || "—"}{!r.ok && r.q.answer ? ` · Correct: ${r.q.answer}` : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button onClick={() => start()}>Try again</Button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Question {index + 1} / {questions.length}</span>
        <span className="text-sm font-medium">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
      </div>
      <Progress value={(index / questions.length) * 100} />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{q?.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q?.options && (
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt: string) => (
                <Button key={opt} variant={answers[index] === opt ? "default" : "outline"} size="sm" onClick={() => setAnswers((a) => ({ ...a, [index]: opt }))}>
                  {opt}
                </Button>
              ))}
            </div>
          )}
          {!q?.options && (
            <Input value={answers[index] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [index]: e.target.value }))} placeholder="Your answer" />
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button>
            {index < questions.length - 1 ? (
              <Button onClick={() => setIndex(index + 1)}>Next</Button>
            ) : (
              <Button onClick={() => setFinished(true)}>Finish</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}