"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const LEVELS = ["A1", "A2", "B1", "B2"];
const SKILLS = ["lesen", "hoeren", "schreiben", "sprechen"];
const TYPES = ["mcq", "truefalse", "gapfill", "matching", "writing", "speaking", "open"];

interface CustomUnitRow {
  id: string;
  key: string;
  level: string;
  title: string;
  description: string;
  objective: string;
  recycles: string[] | null;
  order: number;
  unlock_threshold: number;
  exercises: unknown[];
}

const EMPTY = {
  key: "",
  level: "A1",
  title: "",
  description: "",
  objective: "",
  recycles: "",
  order: "99",
  unlockThreshold: "0",
  exercises: JSON.stringify(
    [
      {
        id: "ex-h1",
        skill: "hoeren",
        type: "mcq",
        prompt: "What does the speaker say?",
        options: ["Option A", "Option B", "Option C"],
        answer: "Option A",
        audioText: "German sentence to listen to.",
        transcript: "German sentence to listen to.",
      },
    ],
    null,
    2
  ),
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export default function AdminUnits() {
  const [units, setUnits] = useState<CustomUnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("custom_units").select("*").order("level").order("order");
      if (error) throw new Error(error.message);
      setUnits((data ?? []) as CustomUnitRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load units. Has migration 0002 been run?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const validateExercises = (): { ok: boolean; message: string; parsed?: unknown[] } => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(form.exercises);
    } catch {
      return { ok: false, message: "Exercises must be valid JSON." };
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { ok: false, message: "Exercises must be a non-empty array." };
    }
    for (const [i, e] of (parsed as Record<string, unknown>[]).entries()) {
      if (!e.id || typeof e.id !== "string") return { ok: false, message: `Exercise ${i + 1}: missing string "id".` };
      if (!SKILLS.includes(String(e.skill))) return { ok: false, message: `Exercise ${i + 1}: "skill" must be one of ${SKILLS.join(", ")}.` };
      if (!TYPES.includes(String(e.type))) return { ok: false, message: `Exercise ${i + 1}: "type" must be one of ${TYPES.join(", ")}.` };
      if (!e.prompt || typeof e.prompt !== "string") return { ok: false, message: `Exercise ${i + 1}: missing string "prompt".` };
    }
    return { ok: true, message: "", parsed: parsed as unknown[] };
  };

  const save = async () => {
    setError(null);
    setMessage(null);
    const key = form.key.trim() || slugify(form.title);
    if (!key) return setError("Unit needs a key or a title to derive one.");
    if (!form.title.trim()) return setError("Title is required.");
    const v = validateExercises();
    if (!v.ok) return setError(v.message);

    setSaving(true);
    try {
      const supabase = createClient();
      const row = {
        key,
        level: form.level,
        title: form.title.trim(),
        description: form.description.trim(),
        objective: form.objective.trim(),
        recycles: form.recycles.split(",").map((s) => s.trim()).filter(Boolean),
        order: Number(form.order) || 99,
        unlock_threshold: Number(form.unlockThreshold) || 0,
        exercises: v.parsed,
      };
      const { error } = await supabase.from("custom_units").upsert(row, { onConflict: "key" });
      if (error) throw new Error(error.message);
      setMessage(`Saved unit “${key}”. It now appears on the Units page.`);
      setForm({ ...EMPTY });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (u: CustomUnitRow) => {
    setForm({
      key: u.key,
      level: u.level,
      title: u.title,
      description: u.description ?? "",
      objective: u.objective ?? "",
      recycles: (u.recycles ?? []).join(", "),
      order: String(u.order ?? 99),
      unlockThreshold: String(u.unlock_threshold ?? 0),
      exercises: JSON.stringify(u.exercises ?? [], null, 2),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (key: string) => {
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("custom_units").delete().eq("key", key);
      if (error) throw new Error(error.message);
      setMessage(`Deleted unit “${key}”.`);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  return (
    <div className="space-y-8">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{message}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{form.key ? `Edit unit: ${form.key}` : "Create a unit"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium">Unit key (unique id, used in the URL)</span>
              <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. custom-u1 (blank = derived from title)" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Level</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Title</span>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Unit 7: Free Time & Weather" />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Short description</span>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Talk about the weather and free-time plans." />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Learning objective</span>
              <Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="You can talk about the weather and make plans." />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Recycles (comma-separated)</span>
              <Input value={form.recycles} onChange={(e) => setForm({ ...form, recycles: e.target.value })} placeholder="greetings, numbers" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Order</span>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Unlock at %</span>
                <Input type="number" value={form.unlockThreshold} onChange={(e) => setForm({ ...form, unlockThreshold: e.target.value })} />
              </label>
            </div>
          </div>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Exercises (JSON array)</span>
            <Textarea rows={14} value={form.exercises} onChange={(e) => setForm({ ...form, exercises: e.target.value })} className="font-mono text-xs" />
            <span className="block text-xs text-muted-foreground">
              Each exercise: id, skill (lesen/hoeren/schreiben/sprechen), type (mcq/truefalse/gapfill/matching/writing/speaking/open), prompt; mcq/truefalse also need options + answer; hoeren can have audioText + transcript; writing/speaking need modelAnswer.
            </span>
          </label>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : form.key ? "Update unit" : "Create unit"}</Button>
            {form.key && <Button variant="outline" onClick={() => setForm({ ...EMPTY })}>Cancel edit</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom units ({units.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loading && units.length === 0 && <p className="text-sm text-muted-foreground">No custom units yet.</p>}
          {units.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <Badge>{u.level}</Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.title}</p>
                <p className="truncate text-xs text-muted-foreground">{u.key} · {u.exercises?.length ?? 0} exercises · order {u.order}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => edit(u)}>Edit</Button>
              <Button size="sm" variant="outline" onClick={() => remove(u.key)}>Delete</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
