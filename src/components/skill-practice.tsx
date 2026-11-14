"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUnit, exercisesBySkill, type Unit } from "@/data/units";
import { AudioPlayer } from "@/components/audio-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Mic, MicOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { scoreSpeech, type SpeechScore } from "@/lib/speech-score";
import { addMistake } from "@/lib/mistakes";

export default function SkillPractice({ unitId, skill, unit: unitProp }: { unitId: string; skill: string; unit?: Unit | null }) {
  const router = useRouter();
  const unit = unitProp ?? getUnit(unitId);
  const exercises = unit ? exercisesBySkill(unit, skill as any) : [];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [speechScore, setSpeechScore] = useState<SpeechScore | null>(null);
  const [writingScore, setWritingScore] = useState<number | null>(null);
  const [correction, setCorrection] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  const persistProgress = async (exerciseId: string, completed: boolean, score: number) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("exercise_progress").upsert({
        user_id: user.id,
        exercise_id: exerciseId,
        unit_id: unitId,
        skill,
        completed,
        score,
        updated_at: new Date().toISOString(),
      });
      // Streak + XP: +10 for completing an exercise correctly
      fetch("/api/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpGain: completed ? 10 : 2 }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const ex = exercises.length ? exercises[index] : null;

  useEffect(() => {
    if (!ex) return;
    if (ex.taskType === "questions" || ex.taskType === "picture") {
      if (ex.timeLimit) {
        setTimeLeft(ex.timeLimit);
        const t = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === null || prev <= 1) { clearInterval(t); return 0; }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(t);
      }
    } else {
      setTimeLeft(null);
    }
  }, [index, ex]);

  if (!unit) return <p>Unit not found.</p>;
  if (exercises.length === 0 || !ex) return <p>No exercises for this skill.</p>;

  const checkAnswer = () => {
    let correct = false;
    if (ex.type === "matching" && ex.matchingPairs) {
      correct = ex.matchingPairs.every((p) => (matchAnswers[p.left] ?? "").trim().toLowerCase() === p.right.trim().toLowerCase());
    } else {
      correct = answer.trim().toLowerCase() === (ex.answer ?? "").trim().toLowerCase();
    }
    setChecked(correct);
    persistProgress(ex.id, correct, correct ? 100 : 0);
    if (!correct) {
      const correctAnswer = ex.type === "matching" ? ex.matchingPairs?.map((p) => `${p.left} → ${p.right}`).join("; ") ?? "" : ex.answer ?? "";
      addMistake({
        question: ex.prompt,
        yourAnswer: ex.type === "matching" ? JSON.stringify(matchAnswers) : answer,
        correctAnswer,
        skill: ex.skill,
        level: unit.level,
        source: `Unit ${unit.id}`,
      });
    }
  };

  const submitWriting = async () => {
    setLoading(true);
    setFeedback(null);
    setModelAnswer(null);
    setWritingScore(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "schreiben", level: unit.level, task: ex.prompt, answer, persist: true }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setCorrection(data.correction);
      setModelAnswer(data.modelAnswer);
      if (typeof data.score === "number") setWritingScore(data.score);
      persistProgress(ex.id, true, 80);
    } catch (e) {
      setFeedback("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const submitSpeaking = async (text: string) => {
    setLoading(true);
    setFeedback(null);
    setModelAnswer(null);
    setSpeechScore(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "sprechen", level: unit.level, task: ex.prompt, answer: text }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setModelAnswer(data.modelAnswer);
      if (data.modelAnswer) setSpeechScore(scoreSpeech(text, data.modelAnswer));
      persistProgress(ex.id, true, 80);
    } catch {
      setFeedback("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported"); return; }
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setAnswer(text);
      submitSpeaking(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const next = () => {
    setAnswer("");
    setMatchAnswers({});
    setChecked(null);
    setFeedback(null);
    setModelAnswer(null);
    setSpeechScore(null);
    setWritingScore(null);
    setCorrection(null);
    if (index < exercises.length - 1) setIndex(index + 1);
    else router.push(`/units/${unitId}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge>{unit.level}</Badge>
          <h1 className="mt-1 text-2xl font-bold">{unit.title}</h1>
          <p className="text-muted-foreground">{exercises.length} exercises</p>
        </div>
        <span className="text-sm text-muted-foreground">{index + 1} / {exercises.length}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{ex.prompt}</CardTitle>
          {ex.taskType && ex.taskType !== "free" && (
            <p className="text-xs text-muted-foreground">Task type: {ex.taskType}{ex.timeLimit ? ` · ${timeLeft ?? ex.timeLimit}s remaining` : ""}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {(ex.skill === "hoeren") && (ex.audioText || ex.audioUrl) && (
            <AudioPlayer src={ex.audioUrl} text={ex.audioText} label="Listen" />
          )}
          {ex.transcript && checked !== null && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Transcript:</p>
              <p>{ex.transcript}</p>
            </div>
          )}

          {ex.vocab && ex.vocab.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ex.vocab.map((v) => (
                <details key={v.word} className="rounded border px-2 py-1 text-sm">
                  <summary className="cursor-pointer font-medium">{v.word}</summary>
                  <span className="text-muted-foreground">{v.definition}</span>
                </details>
              ))}
            </div>
          )}

          {(ex.type === "mcq" || ex.type === "truefalse") && (
            <div className="flex flex-wrap gap-2">
              {ex.options?.map((opt) => (
                <Button
                  key={opt}
                  variant={answer === opt ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setAnswer(opt); }}
                >
                  {opt}
                </Button>
              ))}
            </div>
          )}

          {ex.type === "gapfill" && (
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer" />
          )}

          {ex.type === "matching" && ex.matchingPairs && (
            <div className="space-y-2">
              {ex.matchingPairs.map((p) => (
                <div key={p.left} className="flex items-center gap-2">
                  <span className="w-24 font-medium">{p.left}</span>
                  <select
                    className="rounded-md border bg-background px-2 py-1 text-sm"
                    value={matchAnswers[p.left] ?? ""}
                    onChange={(e) => setMatchAnswers((m) => ({ ...m, [p.left]: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    {ex.matchingPairs!.map((pp) => (
                      <option key={pp.right} value={pp.right}>{pp.right}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {ex.type === "open" && (
            <div className="space-y-2">
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write in German..." className="min-h-[100px]" />
              <Button onClick={() => { submitWriting(); }} disabled={loading || !answer.trim()}>
                {loading ? "Checking..." : "Submit"}
              </Button>
            </div>
          )}

          {ex.type === "writing" && (
            <div className="space-y-2">
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write in German..." className="min-h-[120px]" />
              <Button onClick={submitWriting} disabled={loading || !answer.trim()}>
                {loading ? "Checking..." : "Submit"}
              </Button>
            </div>
          )}

          {ex.type === "speaking" && (
            <div className="space-y-2">
              {ex.modelAnswer && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Listen to a model answer first:</p>
                  <AudioPlayer text={ex.modelAnswer} label="Model answer" />
                </div>
              )}
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Transcript will appear here..." className="min-h-[80px]" />
              <div className="flex gap-2">
                {!listening ? (
                  <Button onClick={startListening}><Mic className="mr-1 h-4 w-4" /> Speak</Button>
                ) : (
                  <Button variant="destructive" onClick={stopListening}><MicOff className="mr-1 h-4 w-4" /> Stop</Button>
                )}
                <Button variant="outline" onClick={() => submitSpeaking(answer)} disabled={loading || !answer.trim()}>
                  {loading ? "Checking..." : "Get feedback"}
                </Button>
              </div>
            </div>
          )}

          {(ex.type === "mcq" || ex.type === "truefalse" || ex.type === "gapfill" || ex.type === "matching") && (
            <div className="flex gap-2">
              <Button onClick={checkAnswer} disabled={ex.type === "matching" ? Object.keys(matchAnswers).length === 0 : !answer.trim()}>Check</Button>
            </div>
          )}

          {checked !== null && (
            <div className={`flex items-center gap-2 text-sm ${checked ? "text-green-600" : "text-red-600"}`}>
              {checked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {checked ? "Correct!" : `Answer: ${ex.answer}`}
            </div>
          )}

          {writingScore !== null && (
            <div className="rounded-md border bg-card p-3 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Task score</p>
                <span className={`text-lg font-bold ${writingScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : writingScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                  {writingScore}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Saved to your Writing Coach history — watch your score trend improve.</p>
            </div>
          )}

          {correction && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-800 dark:bg-emerald-950/40">
              <p className="font-medium text-emerald-800 dark:text-emerald-300">Corrected version</p>
              <p>{correction}</p>
            </div>
          )}

          {feedback && (
            <div className="rounded-md bg-muted p-3 text-sm space-y-1">
              <p>{feedback}</p>
              {modelAnswer && <p className="italic text-muted-foreground">Model: {modelAnswer}</p>}
            </div>
          )}

          {speechScore && (
            <div className="rounded-md border bg-card p-3 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Pronunciation & content score</p>
                <span className={`text-lg font-bold ${speechScore.scorePct >= 70 ? "text-emerald-600 dark:text-emerald-400" : speechScore.scorePct >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                  {speechScore.scorePct}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Words you hit: <span className="text-emerald-600 dark:text-emerald-400">{speechScore.matched.join(", ") || "—"}</span>
                {speechScore.missed.length > 0 && <> · To practise: <span className="text-red-600 dark:text-red-400">{speechScore.missed.join(", ")}</span></>}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={next}>
              {index < exercises.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}