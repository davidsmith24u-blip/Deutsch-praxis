import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Unit, Exercise } from "@/data/units";

interface CustomUnitRow {
  key: string;
  level: string;
  title: string;
  description: string;
  objective: string;
  recycles: string[] | null;
  order: number;
  unlock_threshold: number;
  exercises: Exercise[];
}

function toUnit(row: CustomUnitRow): Unit | null {
  const level = row.level as Unit["level"];
  if (!["A1", "A2", "B1", "B2"].includes(row.level)) return null;
  if (!Array.isArray(row.exercises)) return null;
  return {
    id: row.key,
    level,
    title: row.title,
    description: row.description ?? "",
    objective: row.objective ?? "",
    recycles: row.recycles ?? [],
    order: row.order ?? 99,
    unlockThreshold: row.unlock_threshold ?? 0,
    exercises: row.exercises,
  };
}

/** Fetch admin-created units from Supabase. Returns [] if the table does not exist yet. */
export async function fetchCustomUnits(): Promise<Unit[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("custom_units")
      .select("key,level,title,description,objective,recycles,order,unlock_threshold,exercises");
    if (error || !data) return [];
    return (data as CustomUnitRow[]).map(toUnit).filter((u): u is Unit => u !== null);
  } catch {
    return [];
  }
}

export async function findUnitById(unitId: string): Promise<Unit | null> {
  const custom = await fetchCustomUnits();
  return custom.find((u) => u.id === unitId) ?? null;
}
