"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getRealScenario as getScenario } from "@/data/realScenarios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Volume2, StopCircle } from "lucide-react";
import { speak, stopSpeaking, createRecognizer } from "@/lib/speech";
import { createClient } from "@/lib/supabase/client";

interface Msg {
  role: "user" | "assistant";
  content: string;
  correction?: string | null;
  feedback?: string | null;
  translation?: string | null;
  mistakes?: { grammar_point: string; example: string; correction: string }[];
}

function InterviewSession() {
  const params = useParams();
  const search = useSearchParams();
  const sessionId = String(params?.sessionId ?? "");
  const scenarioId = search.get("scenario") ?? "";
  const level = search.get("level") ?? "A1";
  const scenario = getScenario(scenarioId);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memoryContext, setMemoryContext] = useState("");
  const recognizerRef = useRef<any>(null);
  const startedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // kick off with starter question
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (scenario?.starter) {
      const starter: Msg = { role: "assistant", content: scenario.starter };
      setMessages([starter]);
      speak(scenario.starter);
    }
  }, [scenario]);

  useEffect(() => {
    const loadMemory = async () => {
      if (sessionId.startsWith("local-")) return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: mem } = await supabase.from("user_memory").select("*").eq("user_id", user.id).single();
      const { data: errs } = await supabase.from("mistake_patterns").select("grammar_point,count").eq("user_id", user.id).order("count", { ascending: false }).limit(3);
      let ctx = "";
      if (mem) {
        if (Array.isArray(mem.common_errors) && mem.common_errors.length) ctx += `Recurring mistakes: ${mem.common_errors.join(", ")}. `;
        if (Array.isArray(mem.previous_scenarios) && mem.previous_scenarios.length) ctx += `Previously practiced scenarios: ${mem.previous_scenarios.join(", ")}. `;
        if (mem.user_notes) ctx += `Notes: ${mem.user_notes}. `;
      }
      if (errs && errs.length) ctx += `Top weak points to practice: ${errs.map((e: any) => e.grammar_point).join(", ")}. `;
      setMemoryContext(ctx);
    };
    loadMemory();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interim]);

  const persistMessage = async (role: "user" | "assistant", content: string, correction?: string | null) => {
    if (sessionId.startsWith("local-")) return;
    const supabase = createClient();
    await supabase.from("interview_messages").insert({ session_id: sessionId, role, content, correction });
  };

  const persistMistakes = async (mistakes: { grammar_point: string; example: string; correction: string }[]) => {
    if (sessionId.startsWith("local-") || !mistakes?.length) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    for (const m of mistakes) {
      const { data: existing } = await supabase
        .from("mistake_patterns")
        .select("id,count")
        .eq("user_id", user.id)
        .eq("grammar_point", m.grammar_point)
        .maybeSingle();
      if (existing) {
        await supabase
          .from("mistake_patterns")
          .update({ count: (existing.count ?? 0) + 1, example: m.example, correction: m.correction, last_seen: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("mistake_patterns").insert({
          user_id: user.id,
          grammar_point: m.grammar_point,
          example: m.example,
          correction: m.correction,
        });
      }
    }
    const { data: mem } = await supabase.from("user_memory").select("common_errors").eq("user_id", user.id).single();
    const current: string[] = Array.isArray(mem?.common_errors) ? mem.common_errors : [];
    const merged = Array.from(new Set([...current, ...mistakes.map((m) => m.grammar_point)]));
    await supabase.from("user_memory").upsert({ user_id: user.id, common_errors: merged, updated_at: new Date().toISOString() });
  };

  const sendUserMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setInterim("");
    await persistMessage("user", trimmed);
    setLoading(true);
    setError(null);
    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          scenarioTitle: scenario?.title ?? "Conversation",
          systemPrompt: scenario?.systemPrompt ?? "",
          memory: memoryContext,
          messages: history,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const assistantMsg: Msg = {
        role: "assistant",
        content: data.reply,
        correction: data.correction,
        feedback: data.feedback,
        translation: data.translation,
        mistakes: data.mistakes ?? [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      await persistMessage("assistant", data.reply, data.correction);
      if (Array.isArray(data.mistakes)) await persistMistakes(data.mistakes);
      speak(data.reply);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (listening) {
      recognizerRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = createRecognizer(
      (transcript, isFinal) => {
        setInterim(transcript);
        if (isFinal) {
          setInput((prev) => (prev ? prev + " " : "") + transcript);
          setInterim("");
        }
      },
      () => setListening(false)
    );
    if (!rec) {
      setError("Speech recognition not supported in this browser. Use Chrome/Edge.");
      return;
    }
    recognizerRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("Could not start microphone.");
    }
  };

  const endSession = async () => {
    stopSpeaking();
    if (!sessionId.startsWith("local-")) {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level,
            scenarioTitle: scenario?.title ?? "Conversation",
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("conversation_summaries").insert({
            session_id: sessionId,
            user_id: user.id,
            scenario_key: scenarioId,
            summary: data.summary ?? "",
            mistakes: data.mistakes ?? [],
          });
          const { data: mem } = await supabase.from("user_memory").select("previous_scenarios").eq("user_id", user.id).single();
          const prev: string[] = Array.isArray(mem?.previous_scenarios) ? mem.previous_scenarios : [];
          if (!prev.includes(scenarioId)) {
            await supabase.from("user_memory").upsert({
              user_id: user.id,
              previous_scenarios: [...prev, scenarioId],
              updated_at: new Date().toISOString(),
            });
          }
        }
        await supabase.from("interview_sessions").update({ ended_at: new Date().toISOString(), feedback: { summary: data.summary } }).eq("id", sessionId);
      } catch {
        // ignore
      }
    }
    window.location.href = "/interview";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{scenario?.title ?? "Interview"}</h1>
          <p className="text-sm text-muted-foreground">{scenario?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{level}</Badge>
          <Button variant="outline" size="sm" onClick={endSession}>End</Button>
        </div>
      </div>

      <Card className="h-[60vh] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p>{m.content}</p>
                {m.role === "assistant" && m.correction && (
                  <p className="mt-1 text-xs opacity-80">Correction: {m.correction}</p>
                )}
                {m.role === "assistant" && m.feedback && (
                  <p className="mt-1 text-xs opacity-80">Feedback: {m.feedback}</p>
                )}
                {m.role === "assistant" && m.translation && (
                  <p className="mt-1 text-xs italic opacity-70">{m.translation}</p>
                )}
                {m.role === "assistant" && (
                  <button className="mt-1 text-xs underline opacity-70" onClick={() => speak(m.content)}>
                    <Volume2 className="inline h-3 w-3 mr-1" />Replay
                  </button>
                )}
              </div>
            </div>
          ))}
          {interim && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-primary/50 p-3 text-sm italic">{interim}…</div>
            </div>
          )}
          {loading && <p className="text-sm text-muted-foreground">Thinking…</p>}
          <div ref={bottomRef} />
        </CardContent>
        <div className="border-t p-3 space-y-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or speak in German…"
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage(input);
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={listening ? "destructive" : "outline"} size="sm" onClick={toggleListen}>
              {listening ? <><MicOff className="mr-1 h-4 w-4" />Stop</> : <><Mic className="mr-1 h-4 w-4" />Speak</>}
            </Button>
            <Button size="sm" onClick={() => sendUserMessage(input)} disabled={loading || !input.trim()}>
              <Send className="mr-1 h-4 w-4" />Send
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { stopSpeaking(); }}>
              <StopCircle className="mr-1 h-4 w-4" />Stop audio
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <InterviewSession />
    </Suspense>
  );
}