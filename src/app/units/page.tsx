import { LEVELS, unitsByLevel, SKILLS } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UnitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Units</h1>
        <p className="text-muted-foreground">
          Goethe-style practice across all four skills. Each unit has a clear learning objective.
        </p>
      </div>
      {LEVELS.map((lvl) => {
        const units = unitsByLevel(lvl.code as any);
        return (
          <section key={lvl.code} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
                {lvl.code}
              </span>
              <div>
                <h2 className="text-xl font-semibold">{lvl.title}</h2>
                <p className="text-sm text-muted-foreground">{lvl.description}</p>
              </div>
              <Badge className="ml-auto">{units.length} units</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((u) => (
                <Link key={u.id} href={`/units/${u.id}`} className="group">
                  <Card className="h-full group-hover:border-primary/50">
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-lg">{u.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{u.objective}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => {
                          const count = u.exercises.filter((e) => e.skill === s.code).length;
                          return (
                            <span
                              key={s.code}
                              title={`${count} ${s.title} exercises`}
                              aria-label={`${count} ${s.title} exercises`}
                              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              <span aria-hidden="true">{s.icon}</span> {count}
                            </span>
                          );
                        })}
                      </div>
                      {u.recycles && u.recycles.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Recycles: {u.recycles.join(", ")}
                        </p>
                      )}
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
