import { notFound } from "next/navigation";
import Link from "next/link";
import { getGrammar } from "@/data/grammar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function GrammarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getGrammar(id);
  if (!t) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <Badge>{t.level}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.summary}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {t.rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 text-primary" aria-hidden="true">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {t.examples.map((e, i) => (
              <li key={i} className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="font-medium">{e.de}</p>
                <p className="text-sm text-muted-foreground">{e.en}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {t.pitfalls && t.pitfalls.length > 0 && (
        <Card className="border-amber-400/60">
          <CardHeader>
            <CardTitle className="text-lg">⚠️ Common pitfalls</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {t.pitfalls.map((p, i) => (
                <li key={i} className="text-sm">{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground">
        <Link href="/grammar" className="text-primary underline">← Back to grammar reference</Link>
      </p>
    </div>
  );
}
