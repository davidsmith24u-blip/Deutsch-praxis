// Word-level speech scoring: compares a spoken transcript to a model answer.

export interface SpeechScore {
  scorePct: number;
  matched: string[];
  missed: string[];
  extra: string[];
}

const STOP = new Set(["ich", "und", "ist", "ein", "eine", "der", "die", "das", "zu", "in", "mit", "den", "dem", "sie", "er", "es", "nicht", "auch", "für", "auf", "bei", "von", "im", "am", "haben", "hat", "sehr"]);

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
}

function tokenize(s: string): string[] {
  return s.split(/\s+/).map(normalizeWord).filter(Boolean);
}

export function scoreSpeech(transcript: string, modelAnswer: string): SpeechScore {
  const spoken = tokenize(transcript);
  const model = tokenize(modelAnswer);
  const spokenSet = new Set(spoken);

  // Content words in the model that the learner produced (stop words don't count against you)
  const modelContent = model.filter((w) => !STOP.has(w));
  const matched: string[] = [];
  const missed: string[] = [];
  for (const w of modelContent) {
    if (spokenSet.has(w)) matched.push(w);
    else missed.push(w);
  }
  const modelSet = new Set(modelContent);
  const extra = spoken.filter((w) => !modelSet.has(w) && !STOP.has(w));

  const denom = Math.max(modelContent.length, 1);
  const scorePct = Math.round((matched.length / denom) * 100);
  return { scorePct, matched, missed, extra };
}
