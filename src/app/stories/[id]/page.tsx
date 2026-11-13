import { notFound } from "next/navigation";
import Link from "next/link";
import { getStory, STORIES } from "@/data/stories";
import StoryQuiz from "@/components/story-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = getStory(id);
  if (!story) notFound();

  const idx = STORIES.findIndex((s) => s.id === id);
  const next = STORIES[(idx + 1) % STORIES.length];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <Badge>{story.level}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{story.title}</h1>
        <p className="text-muted-foreground">{story.summary}</p>
      </div>

      <article className="space-y-4 rounded-2xl border bg-card p-6">
        {story.paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-7">
            {p}
          </p>
        ))}
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 sm:grid-cols-2">
            {story.vocab.map((v) => (
              <div key={v.word} className="rounded-lg border px-3 py-2 text-sm">
                <dt className="font-medium">{v.word}</dt>
                <dd className="text-muted-foreground">{v.definition}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <StoryQuiz story={story} />

      <p className="text-sm text-muted-foreground">
        Next story:{" "}
        <Link href={`/stories/${next.id}`} className="text-primary underline">
          {next.title} ({next.level})
        </Link>
      </p>
    </div>
  );
}
