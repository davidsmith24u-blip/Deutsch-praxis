import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LEVELS } from "@/data/curriculum";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Learn German from A1 to B2
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          DeutschPraxis combines structured lessons with AI voice interview practice to help you speak confidently.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/signup" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Get started
          </Link>
          <Link href="/curriculum" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-accent">
            Browse curriculum
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {LEVELS.map((l) => (
          <Card key={l.code}>
            <CardHeader>
              <CardTitle>{l.code}</CardTitle>
              <CardDescription>{l.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/curriculum" className="text-sm underline">Explore</Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Structured lessons</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">Grammar, vocabulary, and exercises for every CEFR level.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Voice practice</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">Speak with an AI interviewer and get instant feedback.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Track progress</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">XP, streaks, and estimated level keep you motivated.</CardContent>
        </Card>
      </section>
    </div>
  );
}