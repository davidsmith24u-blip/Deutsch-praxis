"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export function VoiceInterview({ level = "a1" }: { level: string }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    // TODO: Send transcript to LLM with level-appropriate prompt
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 min-h-[200px]">
        <p className="text-muted-foreground">
          {transcript || "Press the microphone and start speaking in German..."}
        </p>
      </div>

      <div className="flex gap-4">
        {!isListening ? (
          <Button onClick={startListening} size="lg">
            🎤 Start Speaking
          </Button>
        ) : (
          <Button onClick={stopListening} variant="destructive" size="lg">
            Stop
          </Button>
        )}
      </div>
    </div>
  );
}