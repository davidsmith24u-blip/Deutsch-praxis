"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { schedule, type Rating } from "@/lib/srs";
import { AudioPlayer } from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface CardRow {
  id: string;
  front: string;
  back: string;
  source: string;
  interval_days: number;
  ease: number;
  reps: number;
  lapses: number;
  due_at: string;
}

export default function ReviewClient() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ due: 0, total: 0, reviewedToday: 0, doneToday: 0 });
  const [sessionDone, setSessionDone] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in to review."); setLoading(false); return; }

      const now = new Date().toISOString();
      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);

      const [{ data: due, error: e1 }, { count: total }, { count: reviewed }] = await Promise.all([
        supabase.from("srs_cards").select("*").eq("user_id", user.id).lte("due_at", now).order("due_at").limit(20),
        supabase.from("srs_cards").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("srs_cards").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("due_at", startOfDay.toISOString()),
      ]);
      if (e1) throw new Error(e1.message);

      setCards(due ?? []);
      const [{ count: done }] = await Promise.all([
        supabase.from("exercise_progress").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).gte("updated_at", startOfDay.toISOString()),
      ]);
      setStats({ due: due?.length ?? 0, total: total ?? 0, reviewedToday: reviewed ?? 0, doneToday: done ?? 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load review cards. Has migration 0003 been run?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rate = async (rating: Rating) => {
    const card = cards[0];
    if (!card) return;
    const next = schedule({ interval_days: card.interval_days, ease: card.ease, reps: card.reps, lapses: card.lapses }, rating);
    setFlipped(false);
    setSessionDone((s) => s + 1);
    fetch("/api/streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xpGain: 2 }),
    }).catch(() => {});
    // optimistic: remove from queue
    setCards((c) => c.slice(1));
    try {
      const supabase = createClient();
      await supabase.from("srs_cards").update({
        interval_days: next.intervalDays,
        ease: next.ease,
        reps: next.reps,
        lapses: next.lapses,
        due_at: next.dueAt.toISOString(),
        last_reviewed_at: new Date().toISOString(),
      }).eq("id", card.id);
    } catch {
      // non-fatal
    }
    setStats((s) => ({ ...s, reviewedToday: s.reviewedToday + 1 }));
  };

  const seedFromVocab = async () => {
    setSeeding(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch("/api/vocab");
      const items: Array<{ word: string; definition: string }> = await res.json();
      const rows = items.map((v) => ({ user_id: user.id, front: v.word, back: v.definition, source: "vocab" }));
      const { error } = await supabase.from("srs_cards").upsert(rows, { onConflict: "user_id,front", ignoreDuplicates: true });
      if (error) throw new Error(error.message);
      setMessage(`Imported ${items.length} vocabulary words.`);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setSeeding(false);
    }
  };

  const card = cards[0];

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  if (error) return <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4 text-center">
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.due}</p><p className="text-xs text-muted-foreground">due now</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">cards total</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.reviewedToday}</p><p className="text-xs text-muted-foreground">reviewed today</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="flex items-center justify-center gap-1 text-2xl font-bold"><Flame className="h-5 w-5 text-orange-500" />{stats.doneToday}</p><p className="text-xs text-muted-foreground">exercises today</p></CardContent></Card>
      </div>

      {msg && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{msg}</p>}

      {stats.total === 0 && (
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <p className="text-muted-foreground">Your review deck is empty. Import the built-in vocabulary (from all units + the Goethe-style Wortliste) to start spaced repetition.</p>
            <Button onClick={seedFromVocab} disabled={seeding}>{seeding ? "Importing…" : "Import vocabulary deck"}</Button>
          </CardContent>
        </Card>
      )}

      {card ? (
        <Card className="mx-auto max-w-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center gap-2">
              <Badge className="border">{card.source === "wortliste" ? "Wortliste" : card.source.startsWith("unit:") ? `Unit ${card.source.split(":")[1]}` : card.source}</Badge>
              <Badge className="border">{card.reps} reviews</Badge>
            </div>
            <CardTitle className="text-2xl">{card.front}</CardTitle>
            <AudioPlayer text={card.front} label="Hear it" />
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {flipped ? (
              <>
                <p className="text-lg text-muted-foreground">{card.back}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Button variant="destructive" onClick={() => rate("again")}>Again</Button>
                  <Button variant="outline" onClick={() => rate("hard")}>Hard</Button>
                  <Button onClick={() => rate("good")}>Good</Button>
                  <Button variant="secondary" onClick={() => rate("easy")}>Easy</Button>
                </div>
                <p className="text-xs text-muted-foreground">Again = 10 min · Hard ≈ {Math.max(1, Math.round((card.interval_days || 0.25) * 1.2))} d · Good ≈ {card.interval_days > 0 ? Math.round(card.interval_days * card.ease) : 1} d · Easy ≈ {card.interval_days > 0 ? Math.round(card.interval_days * card.ease * 1.3) : 3} d</p>
              </>
            ) : (
              <Button size="lg" onClick={() => setFlipped(true)}>Show answer</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        stats.total > 0 && (
          <Card className="mx-auto max-w-xl">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-3xl">🎉</p>
              <p className="text-lg font-semibold">All caught up!</p>
              <p className="text-sm text-muted-foreground">You reviewed {sessionDone} card{sessionDone === 1 ? "" : "s"} this session. Next cards become due later — come back tomorrow.</p>
              <Button variant="outline" onClick={load}>Refresh</Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
