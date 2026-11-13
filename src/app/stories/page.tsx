import Link from "next/link";
import { STORIES, type Story } from "@/data/stories";
import { LEVELS } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = { title: "Stories — DeutschPraxis" };

const LEVEL_CODES = LEVELS.map((l) => l.code);

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Stories 📚</h1>
        <p className="text-muted-foreground">
          Read German the fun way — short stories with comprehension questions and vocabulary. Pick
          your level.
        </p>
      </div>

      {LEVEL_CODES.filter((lvl) => STORIES.some((s) => s.level === lvl)).map((lvl) => {
        const stories = STORIES.filter((s: Story) => s.level === lvl);
        return (
          <section key={lvl} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
                {lvl}
              </span>
              <h2 className="text-xl font-semibold">{stories.length} stor{stories.length === 1 ? "y" : "ies"}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s) => (
                <Link key={s.id} href={`/stories/${s.id}`} className="group">
                  <Card className="h-full group-hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{s.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {s.paragraphs.length} paragraphs · {s.questions.length} questions ·{" "}
                        {s.vocab.length} words
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
