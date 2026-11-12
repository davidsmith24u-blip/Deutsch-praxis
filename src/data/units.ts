export type Skill = "lesen" | "hoeren" | "schreiben" | "sprechen";
export type LevelCode = "A1" | "A2" | "B1" | "B2";

export interface Exercise {
  id: string;
  skill: Skill;
  type: "mcq" | "truefalse" | "gapfill" | "matching" | "writing" | "speaking" | "open";
  prompt: string;
  options?: string[];
  answer?: string;
  audioText?: string;
  audioUrl?: string;
  transcript?: string;
  modelAnswer?: string;
  vocab?: { word: string; definition: string }[];
  taskType?: "free" | "picture" | "questions" | "roleplay";
  timeLimit?: number;
  matchingPairs?: { left: string; right: string }[];
}

export interface Unit {
  id: string;
  level: LevelCode;
  title: string;
  description: string;
  objective: string;
  recycles?: string[];
  order: number;
  unlockThreshold: number; // percent of previous unit to unlock
  exercises: Exercise[];
}

export const UNITS: Unit[] = [
  {
    id: "a1-u1",
    level: "A1",
    title: "Unit 1: Greetings & Introductions",
    description: "Say hello, introduce yourself, and ask basic questions.",
    objective: "You can introduce yourself and ask someone's name and origin.",
    recycles: [],
    order: 1,
    unlockThreshold: 0,
    exercises: [
      { id: "a1u1-h1", skill: "hoeren", type: "mcq", prompt: "What is the woman's name?", options: ["Anna", "Maria", "Sophie"], answer: "Anna", audioText: "Hallo, ich heiße Anna. Und wie heißt du?", transcript: "Hallo, ich heiße Anna. Und wie heißt du?" },
      { id: "a1u1-h2", skill: "hoeren", type: "truefalse", prompt: "The speaker says 'Guten Morgen'.", options: ["True", "False"], answer: "True", audioText: "Guten Morgen! Wie geht es dir?", transcript: "Guten Morgen! Wie geht es dir?" },
      { id: "a1u1-h3", skill: "hoeren", type: "gapfill", prompt: "Fill in the missing word: Guten ___, wie heißt du?", answer: "Tag", audioText: "Guten Tag, wie heißt du?", transcript: "Guten Tag, wie heißt du?" },
      { id: "a1u1-r1", skill: "lesen", type: "mcq", prompt: "What does 'Ich komme aus Spanien' mean?", options: ["I live in Spain", "I come from Spain", "I work in Spain"], answer: "I come from Spain", vocab: [{ word: "kommen", definition: "to come" }, { word: "aus", definition: "from" }] },
      { id: "a1u1-r2", skill: "lesen", type: "truefalse", prompt: "The email says the meeting is at 10:00.", options: ["True", "False"], answer: "False", vocab: [] },
      { id: "a1u1-r3", skill: "lesen", type: "matching", prompt: "Match the German words to their English meanings.", matchingPairs: [{ left: "Hallo", right: "hello" }, { left: "Danke", right: "thank you" }, { left: "Bitte", right: "please" }] },
      { id: "a1u1-r4", skill: "lesen", type: "open", prompt: "Write one sentence about where you live (in German).", modelAnswer: "Ich wohne in Berlin." },
      { id: "a1u1-s1", skill: "schreiben", type: "writing", prompt: "Write a short message introducing yourself (name, origin, age).", modelAnswer: "Hallo! Ich heiße Tom. Ich komme aus England und bin 25 Jahre alt." },
      { id: "a1u1-sp1", skill: "sprechen", type: "speaking", prompt: "Introduce yourself in German (name, origin, age).", modelAnswer: "Hallo, ich heiße ... Ich komme aus ... und bin ... Jahre alt.", taskType: "free" },
      { id: "a1u1-sp2", skill: "sprechen", type: "speaking", prompt: "Describe this picture in 4 sentences: a family at a train station.", modelAnswer: "Ich sehe eine Familie am Bahnhof. Der Mann hat einen Koffer. Die Frau liest ein Ticket. Das Kind spielt.", taskType: "picture", timeLimit: 60 },
    ],
  },
  {
    id: "a1-u2",
    level: "A1",
    title: "Unit 2: Numbers & Time",
    description: "Count, tell the time, and state dates.",
    objective: "You can tell the time and state numbers in everyday situations.",
    recycles: ["greetings", "sein", "haben"],
    order: 2,
    unlockThreshold: 60,
    exercises: [
      { id: "a1u2-h1", skill: "hoeren", type: "mcq", prompt: "What time is it?", options: ["2:30", "3:00", "3:30"], answer: "2:30", audioText: "Es ist halb drei.", transcript: "Es ist halb drei." },
      { id: "a1u2-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: Es ist ___ acht. (7:30)", answer: "halb", audioText: "Es ist halb acht.", transcript: "Es ist halb acht." },
      { id: "a1u2-r1", skill: "lesen", type: "mcq", prompt: "How many children does the family have?", options: ["1", "2", "3"], answer: "2" },
      { id: "a1u2-r2", skill: "lesen", type: "matching", prompt: "Match numbers to words.", matchingPairs: [{ left: "1", right: "eins" }, { left: "2", right: "zwei" }, { left: "3", right: "drei" }] },
      { id: "a1u2-s1", skill: "schreiben", type: "writing", prompt: "Write: 'I have two siblings and live in Munich.'", modelAnswer: "Ich habe zwei Geschwister und wohne in München." },
      { id: "a1u2-sp1", skill: "sprechen", type: "speaking", prompt: "Say the numbers 1 to 10 in German.", modelAnswer: "eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn" },
    ],
  },
  {
    id: "a1-u3",
    level: "A1",
    title: "Unit 3: Food & Ordering",
    description: "Order food and drinks at a café.",
    objective: "You can order food and drinks and understand simple menus.",
    recycles: ["greetings", "numbers", "möchten"],
    order: 3,
    unlockThreshold: 60,
    exercises: [
      { id: "a1u3-h1", skill: "hoeren", type: "mcq", prompt: "What does the customer order?", options: ["Coffee and cake", "Tea and sandwich", "Water and salad"], answer: "Coffee and cake", audioText: "Ich hätte gerne einen Kaffee und ein Stück Kuchen.", transcript: "Ich hätte gerne einen Kaffee und ein Stück Kuchen." },
      { id: "a1u3-r1", skill: "lesen", type: "truefalse", prompt: "The menu says the soup costs 5 Euro.", options: ["True", "False"], answer: "True" },
      { id: "a1u3-s1", skill: "schreiben", type: "writing", prompt: "Write a short order message for a café.", modelAnswer: "Guten Tag! Ich hätte gerne einen Kaffee und ein Croissant, bitte." },
      { id: "a1u3-sp1", skill: "sprechen", type: "speaking", prompt: "Order food at a café in German.", modelAnswer: "Ich hätte gerne ..., bitte." },
    ],
  },

// A2 units
{
  id: "a2-u1",
  level: "A2",
  title: "Unit 1: Daily Routine",
  description: "Describe your day and daily habits.",
  objective: "You can describe your daily routine and ask about someone else's.",
  recycles: ["greetings", "time", "verbs"],
  order: 1,
  unlockThreshold: 0,
  exercises: [
    { id: "a2u1-h1", skill: "hoeren", type: "mcq", prompt: "What time does she wake up?", options: ["6:00", "7:00", "8:00"], answer: "7:00", audioText: "Ich stehe um sieben Uhr auf.", transcript: "Ich stehe um sieben Uhr auf." },
    { id: "a2u1-r1", skill: "lesen", type: "truefalse", prompt: "The text says he works from home.", options: ["True", "False"], answer: "True" },
    { id: "a2u1-s1", skill: "schreiben", type: "writing", prompt: "Write about your morning routine (3-4 sentences).", modelAnswer: "Ich stehe um 7 Uhr auf. Dann frühstücke ich. Um 8 Uhr gehe ich zur Arbeit." },
    { id: "a2u1-sp1", skill: "sprechen", type: "speaking", prompt: "Describe your daily routine.", modelAnswer: "Ich stehe um ... auf. Dann ...", taskType: "free" },
  ],
},
{
  id: "a2-u2",
  level: "A2",
  title: "Unit 2: Hobbies & Free Time",
  description: "Talk about hobbies and preferences.",
  objective: "You can talk about your hobbies and ask others about theirs.",
  recycles: ["modals", "preferences"],
  order: 2,
  unlockThreshold: 60,
  exercises: [
    { id: "a2u2-h1", skill: "hoeren", type: "gapfill", prompt: "Fill in: Ich spiele gern ___.", answer: "Fußball", audioText: "Ich spiele gern Fußball.", transcript: "Ich spiele gern Fußball." },
    { id: "a2u2-r1", skill: "lesen", type: "mcq", prompt: "What does 'Ich mag Musik' mean?", options: ["I make music", "I like music", "I play music"], answer: "I like music" },
    { id: "a2u2-s1", skill: "schreiben", type: "writing", prompt: "Write about your favorite hobby.", modelAnswer: "Mein Hobby ist Lesen. Ich lese jeden Abend." },
    { id: "a2u2-sp1", skill: "sprechen", type: "speaking", prompt: "Talk about your hobbies for 30 seconds.", modelAnswer: "In meiner Freizeit...", taskType: "free", timeLimit: 30 },
  ],
},
// B1 units
{
  id: "b1-u1",
  level: "B1",
  title: "Unit 1: Travel & Experiences",
  description: "Talk about trips and experiences.",
  objective: "You can describe a trip and share experiences.",
  recycles: ["Perfekt", "subordinate clauses"],
  order: 1,
  unlockThreshold: 0,
  exercises: [
    { id: "b1u1-h1", skill: "hoeren", type: "mcq", prompt: "Where did she travel?", options: ["Spain", "Italy", "France"], answer: "Italy", audioText: "Ich war letztes Jahr in Italien.", transcript: "Ich war letztes Jahr in Italien." },
    { id: "b1u1-r1", skill: "lesen", type: "truefalse", prompt: "The writer enjoyed the food.", options: ["True", "False"], answer: "True" },
    { id: "b1u1-s1", skill: "schreiben", type: "writing", prompt: "Write a short email about a recent trip.", modelAnswer: "Liebe Anna, ich war in Italien. Es war toll. Viele Grüße, Tom." },
    { id: "b1u1-sp1", skill: "sprechen", type: "speaking", prompt: "Describe a memorable trip.", modelAnswer: "Ich war in ... Es war ...", taskType: "free" },
  ],
},
{
  id: "b1-u2",
  level: "B1",
  title: "Unit 2: Work & Career",
  description: "Discuss work, applications, and career goals.",
  objective: "You can talk about your job and career plans.",
  recycles: ["modals", "opinions"],
  order: 2,
  unlockThreshold: 60,
  exercises: [
    { id: "b1u2-h1", skill: "hoeren", type: "gapfill", prompt: "Fill in: Ich arbeite als ___.", answer: "Ingenieur", audioText: "Ich arbeite als Ingenieur.", transcript: "Ich arbeite als Ingenieur." },
    { id: "b1u2-r1", skill: "lesen", type: "mcq", prompt: "What is required for the job?", options: ["Experience", "Degree", "Both"], answer: "Both" },
    { id: "b1u2-s1", skill: "schreiben", type: "writing", prompt: "Write a short job application email.", modelAnswer: "Sehr geehrte Damen und Herren, ich bewerbe mich um..." },
    { id: "b1u2-sp1", skill: "sprechen", type: "speaking", prompt: "Answer: Why do you want this job?", modelAnswer: "Ich möchte diese Stelle, weil...", taskType: "questions", timeLimit: 60 },
  ],
},
// B2 units
{
  id: "b2-u1",
  level: "B2",
  title: "Unit 1: Society & Media",
  description: "Discuss news, society, and media.",
  objective: "You can express and justify opinions on social topics.",
  recycles: ["connectors", "argumentation"],
  order: 1,
  unlockThreshold: 0,
  exercises: [
    { id: "b2u1-h1", skill: "hoeren", type: "mcq", prompt: "What is the main topic of the discussion?", options: ["Climate", "Technology", "Education"], answer: "Technology", audioText: "In dieser Sendung geht es um Technologie.", transcript: "In dieser Sendung geht es um Technologie." },
    { id: "b2u1-r1", skill: "lesen", type: "truefalse", prompt: "The author supports the new law.", options: ["True", "False"], answer: "False" },
    { id: "b2u1-s1", skill: "schreiben", type: "writing", prompt: "Write a short opinion text (5 sentences) about social media.", modelAnswer: "Soziale Medien haben Vor- und Nachteile. Einerseits..." },
    { id: "b2u1-sp1", skill: "sprechen", type: "speaking", prompt: "Argue: Is remote work better than office work?", modelAnswer: "Ich bin der Meinung, dass...", taskType: "roleplay" },
  ],
},
{
  id: "b2-u2",
  level: "B2",
  title: "Unit 2: Professional Communication",
  description: "Meetings, presentations, and negotiations.",
  objective: "You can participate in professional meetings and presentations.",
  recycles: ["relative clauses", "advanced connectors"],
  order: 2,
  unlockThreshold: 60,
  exercises: [
    { id: "b2u2-h1", skill: "hoeren", type: "gapfill", prompt: "Fill in: Die Präsentation beginnt um ___.", answer: "neun", audioText: "Die Präsentation beginnt um neun Uhr.", transcript: "Die Präsentation beginnt um neun Uhr." },
    { id: "b2u2-r1", skill: "lesen", type: "mcq", prompt: "What is the meeting about?", options: ["Budget", "Hiring", "Strategy"], answer: "Strategy" },
    { id: "b2u2-s1", skill: "schreiben", type: "writing", prompt: "Write a meeting summary email.", modelAnswer: "Sehr geehrte Kollegen, hier die Zusammenfassung..." },
    { id: "b2u2-sp1", skill: "sprechen", type: "speaking", prompt: "Give a 60-second presentation about your project.", modelAnswer: "Mein Projekt beschäftigt sich mit...", taskType: "questions", timeLimit: 60 },
  ],
},
];

export const LEVELS = [
  { code: "A1", title: "A1 — Beginner", description: "First steps: greetings, personal info, basic sentences." },
  { code: "A2", title: "A2 — Elementary", description: "Daily life, past tense, simple opinions." },
  { code: "B1", title: "B1 — Intermediate", description: "Work, travel, opinions, and more complex grammar." },
  { code: "B2", title: "B2 — Upper Intermediate", description: "Professional and academic communication." },
];

export const SKILLS: { code: Skill; title: string; icon: string }[] = [
  { code: "lesen", title: "Lesen (Reading)", icon: "📖" },
  { code: "hoeren", title: "Hören (Listening)", icon: "🎧" },
  { code: "schreiben", title: "Schreiben (Writing)", icon: "✍️" },
  { code: "sprechen", title: "Sprechen (Speaking)", icon: "🎤" },
];

export function unitsByLevel(level: LevelCode) {
  return UNITS.filter((u) => u.level === level).sort((a, b) => a.order - b.order);
}
export function getUnit(id: string) {
  return UNITS.find((u) => u.id === id);
}
export function exercisesBySkill(unit: Unit, skill: Skill) {
  return unit.exercises.filter((e) => e.skill === skill);
}