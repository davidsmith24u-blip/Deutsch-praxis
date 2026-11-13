"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LEVELS, SKILLS, type Unit } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle } from "lucide-react";

export interface UnitProgress {
  done: number;
  total: number;
}

const ALL_LEVELS = LEVELS.map((l) => l.code);

export default function UnitsClient({
  units,
  progress,
}: {
  units: Unit[];
  progress: Record<string, UnitProgress>;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [skill, setSkill] = useState<string>("all");
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return units
      .filter((u) => {
        if (level !== "all" && u.level !== level) return false;
        if (skill !== "all" && !u.exercises.some((e) => e.skill === skill)) return false;
        if (onlyIncomplete && progress[u.id]?.done === progress[u.id]?.total) return false;
        if (!q) return true;
        return (
          u.title.toLowerCase().includes(q) ||
          u.description.toLowerCase().includes(q) ||
          u.objective.toLowerCase().includes(q) ||
          (u.recycles ?? []).some((r) => r.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => ALL_LEVELS.indexOf(a.level) - ALL_LEVELS.indexOf(b.level) || a.order - b.order);
  }, [units, query, level, skill, onlyIncomplete, progress]);

  const grouped = useMemo(() => {
    const map = new Map<string, Unit[]>();
    for (const u of filtered) {
      const list = map.get(u.level) ?? [];
      list.push(u);
      map.set(u.level, list);
    }
    return map;
  }, [filtered]);

  const chip = (active: boolean) =>
    `inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
      active ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
    }`;

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-2xl border bg-card p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search units by topic, objective, or grammar…"
          aria-label="Search units"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Level:</span>
          <button onClick={() => setLevel("all")} className={chip(level === "all")} aria-pressed={level === "all"}>all</button>
          {ALL_LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={chip(level === l)} aria-pressed={level === l}>{l}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Practise:</span>
          <button onClick={() => setSkill("all")} className={chip(skill === "all")} aria-pressed={skill === "all"}>all</button>
          {SKILLS.map((s) => (
            <button key={s.code} onClick={() => setSkill(s.code)} className={chip(skill === s.code)} aria-pressed={skill === s.code}>
              <span aria-hidden="true">{s.icon}</span> {s.code}
            </button>
          ))}
          <button
            onClick={() => setOnlyIncomplete((v) => !v)}
            className={`${chip(onlyIncomplete)} ml-auto`}
            aria-pressed={onlyIncomplete}
          >
            🔲 Not finished
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" role="status">{filtered.length} unit{filtered.length === 1 ? "" : "s"} found</p>

      {ALL_LEVELS.filter((l) => grouped.has(l)).map((lvl) => (
        <section key={lvl} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {lvl}
            </span>
            <h2 className="text-xl font-semibold">{LEVELS.find((l) => l.code === lvl)?.title}</h2>
            <span className="ml-auto rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {grouped.get(lvl)!.length} units
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.get(lvl)!.map((u) => {
              const p = progress[u.id];
              const complete = p && p.total > 0 && p.done >= p.total;
              return (
                <Link key={u.id} href={`/units/${u.id}`} className="group">
                  <Card className="h-full group-hover:border-primary/50">
                    <CardHeader className="space-y-2">
                      <CardTitle className="flex items-start gap-2 text-lg">
                        {complete ? (
                          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Unit complete" />
                        ) : (
                          <Circle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                        )}
                        <span>{u.title}</span>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{u.objective}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => {
                          const count = u.exercises.filter((e) => e.skill === s.code).length;
                          return (
                            <span
                              key={s.code}
                              title={`${count} ${s.title} exercises`}
                              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              <span aria-hidden="true">{s.icon}</span> {count}
                            </span>
                          );
                        })}
                      </div>
                      {p && p.total > 0 && (
                        <p className="text-xs text-muted-foreground">{p.done}/{p.total} exercises done</p>
                      )}
                      {u.recycles && u.recycles.length > 0 && (
                        <p className="text-xs text-muted-foreground">Recycles: {u.recycles.join(", ")}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
          No units match — try clearing the filters.
        </p>
      )}
    </div>
  );
}
