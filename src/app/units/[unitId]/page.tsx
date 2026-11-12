import { notFound } from "next/navigation";
import { getUnit, SKILLS } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <Badge>{unit.level}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{unit.title}</h1>
        <p className="text-muted-foreground">{unit.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SKILLS.map((s) => {
          const count = unit.exercises.filter((e) => e.skill === s.code).length;
          return (
            <Link key={s.code} href={`/practice/${s.code}/${unit.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{s.icon} {s.title}</CardTitle>
                  <CardDescription>{count} exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge>{count}</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}