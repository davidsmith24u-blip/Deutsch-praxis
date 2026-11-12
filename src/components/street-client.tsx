"use client";

import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { STREET_ITEMS, type StreetItem } from "@/data/street";

function StreetCard({ item, featured }: { item: StreetItem; featured?: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === item.answerIndex;

  return (
    <Card className={featured ? "border-primary/50" : ""}>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{item.icon}</span>
          <Badge>{item.level}</Badge>
          {featured && <Badge className="bg-primary text-primary-foreground">Of the day</Badge>}
        </div>
        <CardTitle className="text-base">{item.context}</CardTitle>
        <CardDescription className="whitespace-pre-line text-base text-foreground">
          {item.authentic}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AudioPlayer text={item.authentic.replace(/[„“↑]/g, "")} label="Listen" />
        <p className="text-sm font-medium">{item.question}</p>
        <div className="flex flex-wrap gap-2">
          {item.options.map((opt, i) => (
            <Button
              key={i}
              size="sm"
              variant={answered ? (i === item.answerIndex ? "default" : i === picked ? "destructive" : "outline") : "outline"}
              onClick={() => setPicked(i)}
            >
              {opt}
            </Button>
          ))}
        </div>
        {answered && (
          <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
            <p className={correct ? "font-medium text-emerald-700 dark:text-emerald-400" : "font-medium text-red-700 dark:text-red-400"}>
              {correct ? "Correct!" : "Not quite."}
            </p>
            <p><span className="font-medium">Wortschatz:</span> {item.vocab.map((v) => `${v.word} = ${v.definition}`).join(" · ")}</p>
            <p className="text-muted-foreground">💡 {item.culture}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function StreetClient({ itemOfTheDay }: { itemOfTheDay: StreetItem }) {
  const [level, setLevel] = useState("all");
  const rest = useMemo(
    () => STREET_ITEMS.filter((i) => i.id !== itemOfTheDay.id && (level === "all" || i.level === level)),
    [itemOfTheDay.id, level]
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Today's item</h2>
        <StreetCard item={itemOfTheDay} featured />
      </section>
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">Archive</h2>
          <div className="ml-auto flex gap-1.5">
            {["all", "A1", "A2", "B1", "B2"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium ${
                  level === l ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((item) => (
            <StreetCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
