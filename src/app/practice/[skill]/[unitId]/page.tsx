import { notFound } from "next/navigation";
import SkillPractice from "@/components/skill-practice";
import { getUnit, type Unit } from "@/data/units";
import { findUnitById } from "@/lib/custom-units";

export const dynamic = "force-dynamic";

export default async function PracticePage({ params }: { params: Promise<{ skill: string; unitId: string }> }) {
  const { skill, unitId } = await params;
  const valid = ["lesen", "hoeren", "schreiben", "sprechen"].includes(skill);
  if (!valid) notFound();
  const unit: Unit | null = getUnit(unitId) ?? (await findUnitById(unitId));
  if (!unit) notFound();
  return <SkillPractice unitId={unitId} skill={skill} unit={unit} />;
}