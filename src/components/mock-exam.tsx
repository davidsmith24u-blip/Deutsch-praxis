"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AudioPlayer } from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface Ex { id: string; skill: string; type: string; prompt: string; options?: string[]; answer?: string; audioText?: string; matchingPairs?: { left: string; right: string }[]; modelAnswer?: string }
interface Module { name: string; icon: string; exercises: Ex[]; passPct: number; }

type Answers = Record<string, string>;

function normalize(s: string) {
  return s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

export default function MockExam({ level, modules }: { level: string; modules: Module[] }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0); // module index
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [speakingText, setSpeakingText] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  const totalSeconds = useMemo(() => 35 * 60, []);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft((p) => { if (p <= 1) { finish(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished]);

  const isCorrect = (ex: Ex, given: string) =>
    !!ex.answer && normalize(given) === normalize(ex.answer);

  const finish = async () => {
    if (finished) return;
    setFinished(true);
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const details = modules.map((m) => {
          const auto = m.exercises.filter((e) => e.answer);
          const correct = auto.filter((e) => isCorrect(e, answers[e.id] ?? "")).length;
          const tasks = m.exercises.filter((e) => !e.answer);
          const taskDone = tasks.every((e) => (answers[e.id] ?? "").trim().length > 0);
          return { module: m.name, correct, auto: auto.length, tasks: tasks.length, taskDone };
        });
        const passedAll = details.every((d) => (d.auto > 0 ? d.correct / d.auto >= 0.6 : true) && (d.tasks === 0 ? true : d.taskDone));
        const totalAuto = details.reduce((a, d) => a + d.auto, 0);
        const totalCorrect = details.reduce((a, d) => a + d.correct, 0);
        await supabase.from("exam_results").insert({
          user_id: user.id,
          level,
          kind: "mock",
          score: totalCorrect,
          max_score: totalAuto,
          passed: passedAll,
          details,
        });
        fetch("/api/streak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ xpGain: 40 }) }).catch(() => {});
      }
    } catch {
      // non-fatal
    } finally {
      setSaving(false);
    }
  };

  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported — type or self-assess instead."); return; }
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setSpeakingText(text);
      setAnswers((a) => ({ ...a, [currentEx.id]: text }));
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-center text-white shadow-lg">
          <h1 className="text-3xl font-bold">Goethe-style Mock Exam · {level}</h1>
          <p className="mt-2 text-white/90">All four modules in one sitting: Hören, Lesen, Schreiben, Sprechen. 35 minutes.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4 text-center">
          {modules.map((m) => (
            <Card key={m.name}><CardContent className="pt-5"><p className="text-2xl">{m.icon}</p><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.exercises.length} task{m.exercises.length === 1 ? "" : "s"}</p></CardContent></Card>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" onClick={() => setStarted(true)}>Start mock exam</Button>
        </div>
      </div>
    );
  }

  if (finished) {
    const results = modules.map((m) => {
      const auto = m.exercises.filter((e) => e.answer);
      const correct = auto.filter((e) => isCorrect(e, answers[e.id] ?? "")).length;
      const tasks = m.exercises.filter((e) => !e.answer);
      const tasksDone = tasks.every((e) => (answers[e.id] ?? "").trim().length > 0);
      const pct = auto.length > 0 ? Math.round((correct / auto.length) * 100) : tasksDone ? 100 : 0;
      const passed = auto.length > 0 ? pct >= 60 && tasksDone : tasksDone;
      return { name: m.name, icon: m.icon, correct, auto: auto.length, tasks: tasks.length, tasksDone, pct, passed };
    });
    const allPassed = results.every((r) => r.passed);

    return (
      <div className="space-y-6">
        <div className={`overflow-hidden rounded-3xl p-10 text-center text-white shadow-lg ${allPassed ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">Mock Exam · {level}</p>
          <h1 className="mt-1 text-4xl font-bold">{allPassed ? "Bestanden!" : "Nicht bestanden"}</h1>
          <p className="mt-2 text-white/90">{allPassed ? `You passed the ${level} mock exam — gut gemacht!` : "Some modules need more practice. You can retake it anytime."}</p>
        </div>
        <div className="space-y-3">
          {results.map((r) => (
            <Card key={r.name}>
              <CardContent className="flex items-center gap-4 pt-5">
                <span className="text-2xl">{r.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.correct}/{r.auto} objective correct{r.tasks > 0 ? ` · ${r.tasksDone ? "task completed" : "task missing"}` : ""}</p>
                </div>
                <div className="w-28"><Progress value={r.pct} /></div>
                {r.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => router.push("/exam")}>Quick exam</Button>
          {allPassed && (
            <Button onClick={() => router.push("/certificate")}>Get certificate 🏅</Button>
          )}
          <Button onClick={() => { setStarted(false); setPhase(0); setAnswers({}); setTimeLeft(totalSeconds); setFinished(false); }}>Retake mock</Button>
        </div>
      </div>
    );
  }

  const mod = modules[phase];
  const currentEx = mod.exercises[0]; // one task shown per module step (listening/reading go one by one)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{mod.icon} {mod.name} · Module {phase + 1}/{modules.length}</span>
        <span className="text-sm font-medium tabular-nums">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
      </div>
      <Progress value={((phase + 1) / modules.length) * 100} />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentEx.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentEx.audioText && <AudioPlayer src={undefined} text={currentEx.audioText} label="Listen" />}

          {currentEx.options && (
            <div className="flex flex-wrap gap-2">
              {currentEx.options.map((opt) => (
                <Button key={opt} variant={answers[currentEx.id] === opt ? "default" : "outline"} size="sm" onClick={() => setAnswers((a) => ({ ...a, [currentEx.id]: opt }))}>
                  {opt}
                </Button>
              ))}
            </div>
          )}
          {!currentEx.options && currentEx.type !== "speaking" && (
            <Textarea
              value={answers[currentEx.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [currentEx.id]: e.target.value }))}
              placeholder="Write your answer in German…"
              className="min-h-[100px]"
            />
          )}
          {currentEx.type === "speaking" && (
            <div className="space-y-2">
              <Textarea value={answers[currentEx.id] ?? speakingText} onChange={(e) => setAnswers((a) => ({ ...a, [currentEx.id]: e.target.value }))} placeholder="Your spoken answer appears here (or type it)…" className="min-h-[80px]" />
              <Button variant={listening ? "destructive" : "outline"} onClick={listening ? () => { recRef.current?.stop?.(); setListening(false); } : startListening}>
                {listening ? "Stop recording" : "🎙 Record answer"}
              </Button>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" disabled={phase === 0} onClick={() => setPhase((p) => p - 1)}>Previous module</Button>
            {phase < modules.length - 1 ? (
              <Button onClick={() => setPhase((p) => p + 1)}>Next module →</Button>
            ) : (
              <Button onClick={finish} disabled={saving}>{saving ? "Saving…" : "Finish exam"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">Modules: Hören & Lesen need ≥60% · Schreiben & Sprechen count when completed.</p>
    </div>
  );
}
