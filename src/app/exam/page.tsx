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

  const start = () => {
    const pool = UNITS.flatMap((u) => u.exercises).filter((e) => e.type === "mcq" || e.type === "truefalse" || e.type === "gapfill");
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 8);
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
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold">Goethe-style Exam Mode</h1>
        <p className="text-muted-foreground">Timed practice with realistic task formats. 5 minutes, 8 questions.</p>
        <Button size="lg" onClick={start}>Start exam</Button>
      </div>
    );
  }

  if (finished) {
    const score = questions.reduce((acc, q, i) => acc + (answers[i]?.trim().toLowerCase() === (q.answer ?? "").trim().toLowerCase() ? 1 : 0), 0);
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold">Exam finished</h1>
        <p className="text-xl">Score: {score} / {questions.length}</p>
        <Button onClick={start}>Retry</Button>
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