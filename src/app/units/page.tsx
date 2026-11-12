import { LEVELS, UNITS, unitsByLevel } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UnitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Units</h1>
        <p className="text-muted-foreground">Goethe-style practice across all four skills.</p>
      </div>
      {LEVELS.map((lvl) => (
        <section key={lvl.code} className="space-y-3">
          <h2 className="text-2xl font-semibold">{lvl.title}</h2>
          <p className="text-muted-foreground">{lvl.description}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unitsByLevel(lvl.code as any).map((u) => (
              <Link key={u.id} href={`/units/${u.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{u.title}</CardTitle>
                    <CardDescription>{u.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>{u.exercises.length} exercises</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}