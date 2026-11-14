"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scoreSpeech, type SpeechScore } from "@/lib/speech-score";

const PHRASES: { level: string; de: string; hint: string }[] = [
  { level: "A1", de: "Guten Tag, wie geht es Ihnen?", hint: "Hello, how are you?" },
  { level: "A1", de: "Ich heiße Anna und komme aus Spanien.", hint: "My name is Anna and I'm from Spain." },
  { level: "A1", de: "Entschuldigung, wo ist der Bahnhof?", hint: "Excuse me, where is the train station?" },
  { level: "A2", de: "Ich habe gestern einen Film gesehen.", hint: "I watched a film yesterday." },
  { level: "A2", de: "Könnten Sie das bitte wiederholen?", hint: "Could you repeat that please?" },
  { level: "A2", de: "Wir fahren am Wochenende an den See.", hint: "We're going to the lake this weekend." },
  { level: "B1", de: "Ich bleibe zu Hause, weil ich krank bin.", hint: "I'm staying home because I'm sick." },
  { level: "B1", de: "Das Buch, das ich lese, ist sehr spannend.", hint: "The book I'm reading is very exciting." },
  { level: "B2", de: "Die Tür ist geschlossen, obwohl niemand da ist.", hint: "The door is closed although no one is there." },
  { level: "C1", de: "Das lässt sich nicht so einfach ändern.", hint: "That can't be changed so easily." },
];

export default function PronunciationPage() {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<SpeechScore | null>(null);
  const [supported, setSupported] = useState(true);

  const phrase = PHRASES[index];

  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);
    setTranscript("");
    setScore(null);
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(text);
      setScore(scoreSpeech(text, phrase.de));
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const next = () => {
    setIndex((i) => (i + 1) % PHRASES.length);
    setTranscript("");
    setScore(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pronunciation practice 🎙️</h1>
        <p className="text-muted-foreground">
          Read the German phrase aloud. Your browser transcribes it and scores how many content
          words you hit. Works best in Chrome or Edge.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
              {phrase.level}
            </span>
            Phrase {index + 1} of {PHRASES.length}
          </CardTitle>
          <CardDescription>{phrase.hint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-medium leading-relaxed">{phrase.de}</p>

          <div className="flex gap-2">
            <Button onClick={startListening} disabled={listening}>
              {listening ? "Listening…" : "🎤 Start speaking"}
            </Button>
            <Button variant="outline" onClick={next}>
              Next phrase →
            </Button>
          </div>

          {!supported && (
            <p className="text-sm text-destructive">
              Speech recognition isn't available in this browser.
            </p>
          )}

          {transcript && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="font-medium">You said:</p>
              <p className="text-muted-foreground">{transcript}</p>
            </div>
          )}

          {score && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score</span>
                <span className="text-2xl font-bold">{score.scorePct}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${score.scorePct}%` }}
                />
              </div>
              {score.missed.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Missed: {score.missed.join(", ")}
                </p>
              )}
              {score.extra.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Extra: {score.extra.join(", ")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {score.scorePct >= 80
                  ? "Sehr gut! 🎉"
                  : score.scorePct >= 50
                    ? "Gut — try again, focusing on the missed words."
                    : "Nochmal — sprich langsam und deutlich."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
