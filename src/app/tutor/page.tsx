"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface Msg {
  role: "user" | "assistant";
  content: string;
  correction?: string | null;
  feedback?: string | null;
}

const STORAGE_KEY = "dp-tutor-messages";
const MEMORY_KEY = "dp-tutor-memory";

export default function TutorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState<string | null>(null);
  const [level, setLevel] = useState("A1");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
      const m = window.localStorage.getItem(MEMORY_KEY);
      if (m) setMemory(m);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("profiles")
          .select("current_level")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => setLevel(p?.current_level ?? "A1"));
      }
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const persist = (msgs: Msg[], mem: string | null) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
      if (mem) window.localStorage.setItem(MEMORY_KEY, mem);
    } catch {
      // ignore
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, level, memory }),
      });
      const data = await res.json();
      const reply: Msg = {
        role: "assistant",
        content: data.reply ?? "…",
        correction: data.correction,
        feedback: data.feedback,
      };
      const updated = [...next, reply];
      setMessages(updated);
      if (data.memory) setMemory(data.memory);
      persist(updated, data.memory ?? memory);
    } catch {
      const updated = [...next, { role: "assistant" as const, content: "Verbindungsfehler. Bitte nochmal versuchen." }];
      setMessages(updated);
      persist(updated, memory);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setMemory(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(MEMORY_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Tutor 🧑‍🏫</h1>
          <p className="text-sm text-muted-foreground">
            Level {level} · conversation + gentle corrections · memory persists
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          New chat
        </Button>
      </div>

      {memory && (
        <p className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium">Tutor memory:</span> {memory}
        </p>
      )}

      <Card className="flex h-[60vh] flex-col">
        <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Start typing in German — or English if you're stuck. The tutor replies in German and
              corrects gently.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.correction && (
                  <p className="mt-1 text-xs opacity-80">✏️ {m.correction}</p>
                )}
                {m.feedback && (
                  <p className="mt-1 text-xs opacity-80">💡 {m.feedback}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                Tutor denkt nach…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </CardContent>
        <div className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Schreibe auf Deutsch… (or English)"
              aria-label="Message to tutor"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/units" className="text-primary underline">Practice units</Link> ·{" "}
        <Link href="/writing" className="text-primary underline">Writing coach</Link>
      </p>
    </div>
  );
}
