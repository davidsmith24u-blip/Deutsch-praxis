"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMistakes, removeMistake, clearMistakes, mistakesBySkill, type Mistake } from "@/lib/mistakes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const refresh = () => setMistakes(getMistakes());

  const filtered = filter === "all" ? mistakes : mistakes.filter((m) => m.skill === filter);
  const counts = mistakesBySkill();
  const skills = ["lesen", "hoeren", "schreiben", "sprechen"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mistake book 📓</h1>
        <p className="text-muted-foreground">
          Every wrong answer you made is saved here for spaced re-drill. {mistakes.length} mistake
          {mistakes.length === 1 ? "" : "s"} total.
        </p>
      </div>

      {mistakes.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg font-semibold">No mistakes yet 🎉</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Get practicing — anything you get wrong will appear here.
            </p>
            <Link href="/units" className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Start practicing
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium ${filter === "all" ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
            >
              All ({mistakes.length})
            </button>
            {skills.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium ${filter === s ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
              >
                {s} ({counts[s] ?? 0})
              </button>
            ))}
            <button
              onClick={() => {
                if (confirm("Clear all mistakes?")) {
                  clearMistakes();
                  refresh();
                }
              }}
              className="ml-auto text-xs text-muted-foreground underline hover:text-destructive"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((m) => (
              <Card key={m.id}>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{m.question}</CardTitle>
                    <button
                      onClick={() => {
                        removeMistake(m.id);
                        refresh();
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive"
                      aria-label="Remove mistake"
                    >
                      ✕
                    </button>
                  </div>
                  <CardDescription>
                    {m.level} · {m.skill} · {new Date(m.createdAt).toLocaleDateString()} · {m.source}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-red-600 dark:text-red-400">Your answer:</span>{" "}
                    <span className="text-muted-foreground">{m.yourAnswer || "(blank)"}</span>
                  </p>
                  <p>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Correct:</span>{" "}
                    <span>{m.correctAnswer}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
