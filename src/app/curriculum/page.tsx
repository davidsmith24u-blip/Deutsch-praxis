import { LEVELS, lessonsByLevel } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Curriculum</h1>
        <p className="text-muted-foreground">Structured lessons from A1 to B2.</p>
      </div>
      {LEVELS.map((lvl) => (
        <section key={lvl.code} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{lvl.title}</h2>
            <Badge>{lessonsByLevel(lvl.code as any).length} lessons</Badge>
          </div>
          <p className="text-muted-foreground">{lvl.description}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessonsByLevel(lvl.code as any).map((lesson) => (
              <Link key={lesson.slug} href={`/lessons/${lesson.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{lesson.vocabulary.length} vocab · {lesson.exercises.length} exercises</p>
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