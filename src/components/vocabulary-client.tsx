"use client";

import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function VocabularyClient({ items }: { items: Array<{ word: string; definition: string; level: string }> }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [flipped, setFlipped] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (v) => (level === "all" || v.level === level) && (!q || v.word.toLowerCase().includes(q) || v.definition.toLowerCase().includes(q))
    );
  }, [items, query, level]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search word or meaning…"
          className="max-w-xs"
          aria-label="Search vocabulary"
        />
        <div className="flex gap-1.5">
          {["all", "A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              aria-pressed={level === l}
              className={`inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium ${
                level === l ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} words</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <Card key={v.word} className="cursor-pointer select-none" onClick={() => setFlipped(flipped === v.word ? null : v.word)}>
            <CardContent className="pt-5 text-center space-y-2">
              <Badge>{v.level}</Badge>
              {flipped === v.word ? (
                <p className="text-lg text-muted-foreground">{v.definition}</p>
              ) : (
                <p className="text-xl font-semibold">{v.word}</p>
              )}
              <div onClick={(e) => e.stopPropagation()}>
                <AudioPlayer text={v.word} label="Hear it" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground">No words match your search.</p>}
      <p className="text-center text-sm text-muted-foreground">
        <Button variant="link" onClick={() => setFlipped(null)}>Flip all back</Button> · tap a card to see the meaning
      </p>
    </div>
  );
}
