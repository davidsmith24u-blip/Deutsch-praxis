export interface Mistake {
  id: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  skill: string;
  level: string;
  source: string;
  createdAt: string;
}

const KEY = "dp-mistakes";

function safeParse(): Mistake[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Mistake[]) : [];
  } catch {
    return [];
  }
}

export function getMistakes(): Mistake[] {
  return safeParse();
}

export function addMistake(m: Omit<Mistake, "id" | "createdAt">): void {
  if (typeof window === "undefined") return;
  const list = safeParse();
  // avoid exact duplicates within 1 hour
  const recent = list.find(
    (x) => x.question === m.question && x.yourAnswer === m.yourAnswer &&
      Date.now() - new Date(x.createdAt).getTime() < 3600_000
  );
  if (recent) return;
  const entry: Mistake = {
    ...m,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  // cap at 500
  const trimmed = list.slice(0, 500);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // storage full — drop oldest
    try {
      window.localStorage.setItem(KEY, JSON.stringify(trimmed.slice(0, 200)));
    } catch {
      // ignore
    }
  }
}

export function removeMistake(id: string): void {
  if (typeof window === "undefined") return;
  const list = safeParse().filter((m) => m.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function clearMistakes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function mistakesBySkill(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of safeParse()) {
    counts[m.skill] = (counts[m.skill] ?? 0) + 1;
  }
  return counts;
}
