import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LEVELS } from "@/data/curriculum";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn German from A1 to B2
          </h1>
          <p className="text-lg text-white/90">
            DeutschPraxis combines structured lessons with AI voice interview practice to help you speak confidently.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-indigo-600 shadow hover:bg-white/90">
              Get started
            </Link>
            <Link href="/units" className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              Browse units
            </Link>
          </div>
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
              <Link href="/units" className="text-sm font-medium text-primary underline">Explore</Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Structured units</CardTitle></CardHeader>
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