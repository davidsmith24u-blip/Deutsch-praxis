"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { speak, stopSpeaking } from "@/lib/speech";

interface AudioPlayerProps {
  src?: string;
  text?: string; // TTS fallback
  label?: string;
}

export function AudioPlayer({ src, text, label }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const toggle = () => {
    if (src && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.playbackRate = speed;
        audioRef.current.play();
        setPlaying(true);
      }
    } else if (text) {
      if (playing) {
        stopSpeaking();
        setPlaying(false);
      } else {
        setPlaying(true);
        speak(text);
        // reset playing after estimated duration
        setTimeout(() => setPlaying(false), Math.max(1500, text.length * 80));
      }
    }
  };

  const replay = () => {
    if (src && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setPlaying(true);
    } else if (text) {
      stopSpeaking();
      setPlaying(true);
      speak(text);
      setTimeout(() => setPlaying(false), Math.max(1500, text.length * 80));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
      <Button size="sm" variant="outline" onClick={toggle}>
        {playing ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
        {playing ? "Pause" : "Play"}
      </Button>
      <Button size="sm" variant="ghost" onClick={replay}>
        <RotateCcw className="mr-1 h-4 w-4" /> Replay
      </Button>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-muted-foreground">Speed:</span>
        {[0.75, 1, 1.25].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded px-2 py-0.5 ${speed === s ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
          >
            {s}x
          </button>
        ))}
      </div>
      {label && <span className="ml-auto text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}