import { notFound } from "next/navigation";
import { UNITS, type Exercise } from "@/data/units";
import MockExam from "@/components/mock-exam";

export const dynamic = "force-dynamic";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;

function byLevel(level: string): Exercise[] {
  return UNITS.filter((u) => u.level === level).flatMap((u) => u.exercises);
}

export default async function MockExamPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: raw } = await params;
  const level = raw.toUpperCase();
  if (!LEVELS.includes(level as (typeof LEVELS)[number])) notFound();

  const ex = byLevel(level);
  const hoeren = ex.filter((e) => e.skill === "hoeren" && e.answer).slice(0, 3);
  const lesen = ex.filter((e) => e.skill === "lesen" && e.answer).slice(0, 3);
  const schreiben = ex.filter((e) => e.skill === "schreiben").slice(0, 1);
  const sprechen = ex.filter((e) => e.skill === "sprechen").slice(0, 1);

  const modules = [
    { name: "Hören (Listening)", icon: "🎧", exercises: hoeren, passPct: 60 },
    { name: "Lesen (Reading)", icon: "📖", exercises: lesen, passPct: 60 },
    { name: "Schreiben (Writing)", icon: "✍️", exercises: schreiben, passPct: 0 },
    { name: "Sprechen (Speaking)", icon: "🗣", exercises: sprechen, passPct: 0 },
  ].filter((m) => m.exercises.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <MockExam level={level} modules={modules} />
    </div>
  );
}
