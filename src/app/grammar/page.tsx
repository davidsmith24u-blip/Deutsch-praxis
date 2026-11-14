import Link from "next/link";
import { GRAMMAR, grammarByLevel } from "@/data/grammar";
import { LEVELS } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = { title: "Grammar reference — DeutschPraxis" };

const LEVEL_CODES = LEVELS.map((l) => l.code);

export default function GrammarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Grammar reference 📖</h1>
        <p className="text-muted-foreground">
          Clear rules, examples, and common pitfalls — from A1 to C2. Bookmark this and come back
          whenever a unit leaves you unsure.
        </p>
      </div>

      {LEVEL_CODES.map((lvl) => {
        const topics = grammarByLevel(lvl);
        if (topics.length === 0) return null;
        return (
          <section key={lvl} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
                {lvl}
              </span>
              <h2 className="text-xl font-semibold">{topics.length} topic{topics.length === 1 ? "" : "s"}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.map((t) => (
                <Link key={t.id} href={`/grammar/${t.id}`} className="group">
                  <Card className="h-full group-hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{t.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {t.rules.length} rules · {t.examples.length} examples
                        {t.pitfalls?.length ? ` · ⚠️ ${t.pitfalls.length} pitfall${t.pitfalls.length === 1 ? "" : "s"}` : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
