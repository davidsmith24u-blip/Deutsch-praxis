"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUnit, exercisesBySkill } from "@/data/units";
import { AudioPlayer } from "@/components/audio-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Mic, MicOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SkillPractice({ unitId, skill }: { unitId: string; skill: string }) {
  const router = useRouter();
  const unit = getUnit(unitId);
  const exercises = unit ? exercisesBySkill(unit, skill as any) : [];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  if (!unit) return <p>Unit not found.</p>;
  if (exercises.length === 0) return <p>No exercises for this skill.</p>;

  const ex = exercises[index];

  const checkAnswer = () => {
    if (ex.type === "mcq" || ex.type === "truefalse") {
      setChecked(answer.trim().toLowerCase() === (ex.answer ?? "").trim().toLowerCase());
    } else if (ex.type === "gapfill") {
      setChecked(answer.trim().toLowerCase() === (ex.answer ?? "").trim().toLowerCase());
    }
  };

  const submitWriting = async () => {
    setLoading(true);
    setFeedback(null);
    setModelAnswer(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "schreiben", level: unit.level, task: ex.prompt, answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setModelAnswer(data.modelAnswer);
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
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "sprechen", level: unit.level, task: ex.prompt, answer: text }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setModelAnswer(data.modelAnswer);
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
    setChecked(null);
    setFeedback(null);
    setModelAnswer(null);
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

          {(ex.type === "mcq" || ex.type === "truefalse" || ex.type === "gapfill") && (
            <div className="flex gap-2">
              <Button onClick={checkAnswer} disabled={!answer.trim()}>Check</Button>
            </div>
          )}

          {checked !== null && (
            <div className={`flex items-center gap-2 text-sm ${checked ? "text-green-600" : "text-red-600"}`}>
              {checked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {checked ? "Correct!" : `Answer: ${ex.answer}`}
            </div>
          )}

          {feedback && (
            <div className="rounded-md bg-muted p-3 text-sm space-y-1">
              <p>{feedback}</p>
              {modelAnswer && <p className="italic text-muted-foreground">Model: {modelAnswer}</p>}
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