import { notFound } from "next/navigation";
import SkillPractice from "@/components/skill-practice";

export default async function PracticePage({ params }: { params: Promise<{ skill: string; unitId: string }> }) {
  const { skill, unitId } = await params;
  const valid = ["lesen", "hoeren", "schreiben", "sprechen"].includes(skill);
  if (!valid) notFound();
  return <SkillPractice unitId={unitId} skill={skill} />;
}