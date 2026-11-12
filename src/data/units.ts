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
  {
    id: "a1-u4",
    level: "A1",
    title: "Unit 4: Shopping & Prices",
    description: "Buy everyday items and ask about prices.",
    objective: "You can buy everyday items and ask how much something costs.",
    recycles: ["numbers", "möchten", "articles"],
    order: 4,
    unlockThreshold: 60,
    exercises: [
      { id: "a1u4-h1", skill: "hoeren", type: "mcq", prompt: "What does the customer buy?", options: ["Two bread rolls", "One cake", "Three apples"], answer: "Two bread rolls", audioText: "Ich möchte zwei Brötchen, bitte.", transcript: "Ich möchte zwei Brötchen, bitte." },
      { id: "a1u4-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: Wie viel ___ das?", answer: "kostet", audioText: "Wie viel kostet das?", transcript: "Wie viel kostet das?" },
      { id: "a1u4-r1", skill: "lesen", type: "mcq", prompt: "A sign says 'Angebot: Äpfel 1,50 € pro kg'. What does 'Angebot' mean?", options: ["Offer / special deal", "Receipt", "Checkout"], answer: "Offer / special deal", vocab: [{ word: "das Angebot", definition: "the offer / special deal" }, { word: "das Kilo", definition: "the kilogram" }] },
      { id: "a1u4-r2", skill: "lesen", type: "matching", prompt: "Match the shopping words.", matchingPairs: [{ left: "der Preis", right: "price" }, { left: "die Kasse", right: "checkout" }, { left: "das Geld", right: "money" }] },
      { id: "a1u4-s1", skill: "schreiben", type: "writing", prompt: "Write a short message with your shopping list.", modelAnswer: "Hallo Tom, ich brauche Brot, Milch und Äpfel. Danke!" },
      { id: "a1u4-sp1", skill: "sprechen", type: "speaking", prompt: "Buy bread and ask for the price.", modelAnswer: "Ich möchte ein Brot, bitte. Wie viel kostet es?", taskType: "free" },
    ],
  },
  {
    id: "a1-u5",
    level: "A1",
    title: "Unit 5: Family & People",
    description: "Talk about your family and describe people.",
    objective: "You can talk about your family and describe people simply.",
    recycles: ["sein", "haben", "possessives"],
    order: 5,
    unlockThreshold: 60,
    exercises: [
      { id: "a1u5-h1", skill: "hoeren", type: "mcq", prompt: "How many siblings does she have?", options: ["One", "Two", "Three"], answer: "Three", audioText: "Ich habe einen Bruder und zwei Schwestern.", transcript: "Ich habe einen Bruder und zwei Schwestern." },
      { id: "a1u5-h2", skill: "hoeren", type: "truefalse", prompt: "She says her brother is older than her.", options: ["True", "False"], answer: "True", audioText: "Mein Bruder ist älter als ich.", transcript: "Mein Bruder ist älter als ich." },
      { id: "a1u5-r1", skill: "lesen", type: "mcq", prompt: "What does 'die Geschwister' mean?", options: ["Parents", "Siblings", "Cousins"], answer: "Siblings", vocab: [{ word: "die Geschwister", definition: "siblings (brothers and sisters)" }] },
      { id: "a1u5-r2", skill: "lesen", type: "open", prompt: "Write one sentence about your family (in German).", modelAnswer: "Meine Familie ist klein." },
      { id: "a1u5-s1", skill: "schreiben", type: "writing", prompt: "Write a short text describing your family (3 sentences).", modelAnswer: "Meine Familie hat vier Personen. Mein Vater ist Lehrer. Meine Mutter kommt aus Polen." },
      { id: "a1u5-sp1", skill: "sprechen", type: "speaking", prompt: "Describe your family.", modelAnswer: "Meine Familie hat ... Personen. Mein ...", taskType: "free" },
    ],
  },
  {
    id: "a1-u6",
    level: "A1",
    title: "Unit 6: Directions & Transport",
    description: "Ask for and give simple directions.",
    objective: "You can ask for directions and understand simple answers.",
    recycles: ["questions", "numbers", "time"],
    order: 6,
    unlockThreshold: 60,
    exercises: [
      { id: "a1u6-h1", skill: "hoeren", type: "mcq", prompt: "Which transport does he take?", options: ["Bus", "U-Bahn (metro)", "Tram"], answer: "U-Bahn (metro)", audioText: "Ich nehme die U-Bahn.", transcript: "Ich nehme die U-Bahn." },
      { id: "a1u6-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: ___ Sie mir bitte den Weg?", answer: "Zeigen", audioText: "Zeigen Sie mir bitte den Weg?", transcript: "Zeigen Sie mir bitte den Weg?" },
      { id: "a1u6-r1", skill: "lesen", type: "truefalse", prompt: "A sign says 'Ausgang'. It means exit.", options: ["True", "False"], answer: "True", vocab: [{ word: "der Ausgang", definition: "the exit" }, { word: "der Eingang", definition: "the entrance" }] },
      { id: "a1u6-r2", skill: "lesen", type: "matching", prompt: "Match the direction words.", matchingPairs: [{ left: "links", right: "left" }, { left: "rechts", right: "right" }, { left: "geradeaus", right: "straight ahead" }] },
      { id: "a1u6-s1", skill: "schreiben", type: "writing", prompt: "Write simple directions from the station to your home.", modelAnswer: "Gehen Sie geradeaus, dann links. Das Haus ist rechts." },
      { id: "a1u6-sp1", skill: "sprechen", type: "speaking", prompt: "Ask a stranger for directions.", modelAnswer: "Entschuldigung, wie komme ich zum Bahnhof?", taskType: "free" },
      { id: "a1u6-sp2", skill: "sprechen", type: "speaking", prompt: "Role-play: you are at the station and need to find the exit.", modelAnswer: "Entschuldigung, wo ist der Ausgang?", taskType: "roleplay" },
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
  {
    id: "a2-u3",
    level: "A2",
    title: "Unit 3: Past Experiences",
    description: "Talk about past events using the Perfekt.",
    objective: "You can talk about past events using the Perfekt tense.",
    recycles: ["haben", "sein", "daily routine"],
    order: 3,
    unlockThreshold: 60,
    exercises: [
      { id: "a2u3-h1", skill: "hoeren", type: "mcq", prompt: "What did he do yesterday?", options: ["Played football", "Watched a film", "Cooked dinner"], answer: "Played football", audioText: "Ich habe gestern Fußball gespielt.", transcript: "Ich habe gestern Fußball gespielt." },
      { id: "a2u3-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: Ich habe einen Film ___. (sehen)", answer: "gesehen", audioText: "Ich habe einen Film gesehen.", transcript: "Ich habe einen Film gesehen." },
      { id: "a2u3-r1", skill: "lesen", type: "truefalse", prompt: "The text says they visited Berlin last year.", options: ["True", "False"], answer: "True" },
      { id: "a2u3-r2", skill: "lesen", type: "open", prompt: "Write one sentence about what you did yesterday.", modelAnswer: "Ich habe Deutsch gelernt." },
      { id: "a2u3-s1", skill: "schreiben", type: "writing", prompt: "Write 3 sentences about your weekend using the Perfekt.", modelAnswer: "Am Samstag habe ich Fußball gespielt. Ich habe Freunde getroffen. Am Sonntag habe ich geschlafen." },
      { id: "a2u3-sp1", skill: "sprechen", type: "speaking", prompt: "Talk about your last weekend.", modelAnswer: "Am Wochenende habe ich ... gemacht.", taskType: "free" },
    ],
  },
  {
    id: "a2-u4",
    level: "A2",
    title: "Unit 4: Shopping & Complaints",
    description: "Shop, ask about products, and make simple complaints.",
    objective: "You can buy products and make a simple complaint politely.",
    recycles: ["shopping", "articles", "modal verbs"],
    order: 4,
    unlockThreshold: 60,
    exercises: [
      { id: "a2u4-h1", skill: "hoeren", type: "mcq", prompt: "What is the problem with the shirt?", options: ["Too big", "Too small", "Broken"], answer: "Too small", audioText: "Das Hemd ist zu klein.", transcript: "Das Hemd ist zu klein." },
      { id: "a2u4-h2", skill: "hoeren", type: "truefalse", prompt: "The customer wants their money back.", options: ["True", "False"], answer: "True", audioText: "Ich möchte mein Geld zurück.", transcript: "Ich möchte mein Geld zurück." },
      { id: "a2u4-r1", skill: "lesen", type: "mcq", prompt: "What does 'umtauschen' mean?", options: ["To exchange", "To pay", "To wrap"], answer: "To exchange", vocab: [{ word: "umtauschen", definition: "to exchange (a product)" }, { word: "die Quittung", definition: "the receipt" }] },
      { id: "a2u4-r2", skill: "lesen", type: "matching", prompt: "Match the shop words.", matchingPairs: [{ left: "die Quittung", right: "receipt" }, { left: "der Umtausch", right: "exchange" }, { left: "die Reklamation", right: "complaint" }] },
      { id: "a2u4-s1", skill: "schreiben", type: "writing", prompt: "Write a short complaint email about a broken product.", modelAnswer: "Sehr geehrte Damen und Herren, der Toaster ist kaputt. Ich möchte ihn umtauschen. Mit freundlichen Grüßen" },
      { id: "a2u4-sp1", skill: "sprechen", type: "speaking", prompt: "Role-play: return a broken product to the shop.", modelAnswer: "Entschuldigung, das ist kaputt. Kann ich es umtauschen?", taskType: "roleplay" },
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
    { id: "b1u1-h2", skill: "hoeren", type: "truefalse", prompt: "He says the food in Italy was disappointing.", options: ["True", "False"], answer: "False", audioText: "Das Essen in Italien war wirklich hervorragend.", transcript: "Das Essen in Italien war wirklich hervorragend." },
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
    { id: "b1u2-h2", skill: "hoeren", type: "mcq", prompt: "What does she want to become?", options: ["A teacher", "An engineer", "A doctor"], answer: "A teacher", audioText: "Später möchte ich als Lehrerin arbeiten.", transcript: "Später möchte ich als Lehrerin arbeiten." },
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
    { id: "b2u1-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: Ich bin der ___, dass Technologie unsere Zukunft prägt.", answer: "Meinung", audioText: "Ich bin der Meinung, dass Technologie unsere Zukunft prägt.", transcript: "Ich bin der Meinung, dass Technologie unsere Zukunft prägt." },
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
    { id: "b2u2-h2", skill: "hoeren", type: "mcq", prompt: "What does she ask for?", options: ["A short summary", "A longer meeting", "A day off"], answer: "A short summary", audioText: "Könnten Sie mir bitte eine kurze Zusammenfassung schicken?", transcript: "Könnten Sie mir bitte eine kurze Zusammenfassung schicken?" },
    { id: "b2u2-r1", skill: "lesen", type: "mcq", prompt: "What is the meeting about?", options: ["Budget", "Hiring", "Strategy"], answer: "Strategy" },
    { id: "b2u2-s1", skill: "schreiben", type: "writing", prompt: "Write a meeting summary email.", modelAnswer: "Sehr geehrte Kollegen, hier die Zusammenfassung..." },
    { id: "b2u2-sp1", skill: "sprechen", type: "speaking", prompt: "Give a 60-second presentation about your project.", modelAnswer: "Mein Projekt beschäftigt sich mit...", taskType: "questions", timeLimit: 60 },
  ],
},
  {
    id: "b1-u3",
    level: "B1",
    title: "Unit 3: Health & Appointments",
    description: "Talk about health, make appointments, and give advice.",
    objective: "You can describe health problems and make or change an appointment.",
    recycles: ["modals", "Perfekt", "time"],
    order: 3,
    unlockThreshold: 60,
    exercises: [
      { id: "b1u3-h1", skill: "hoeren", type: "mcq", prompt: "What is wrong with the speaker?", options: ["A headache", "A broken leg", "A cold"], answer: "A headache", audioText: "Ich habe seit zwei Tagen starke Kopfschmerzen.", transcript: "Ich habe seit zwei Tagen starke Kopfschmerzen." },
      { id: "b1u3-h2", skill: "hoeren", type: "gapfill", prompt: "Fill in: Ich möchte einen Termin ___.", answer: "machen", audioText: "Ich möchte einen Termin machen.", transcript: "Ich möchte einen Termin machen." },
      { id: "b1u3-r1", skill: "lesen", type: "mcq", prompt: "What does 'die Rezeptur' / 'das Rezept' mean at the pharmacy?", options: ["The prescription", "The price", "The doctor"], answer: "The prescription", vocab: [{ word: "das Rezept", definition: "the prescription" }, { word: "die Apotheke", definition: "the pharmacy" }, { word: "die Krankheit", definition: "the illness" }] },
      { id: "b1u3-r2", skill: "lesen", type: "truefalse", prompt: "A note says 'Termin bitte absagen'. You should cancel the appointment.", options: ["True", "False"], answer: "True" },
      { id: "b1u3-s1", skill: "schreiben", type: "writing", prompt: "Write a short email to your doctor's office to move an appointment.", modelAnswer: "Sehr geehrte Damen und Herren, leider kann ich den Termin am Montag nicht wahrnehmen. Könnten wir einen neuen Termin am Donnerstag machen? Mit freundlichen Grüßen" },
      { id: "b1u3-sp1", skill: "sprechen", type: "speaking", prompt: "Describe your symptoms to a doctor.", modelAnswer: "Ich habe ... seit ... Das tut weh.", taskType: "roleplay" },
    ],
  },
  {
    id: "b1-u4",
    level: "B1",
    title: "Unit 4: Housing & Moving",
    description: "Talk about apartments, moving, and neighbours.",
    objective: "You can describe your home and talk about moving and neighbours.",
    recycles: ["adjectives", "weil", "Perfekt"],
    order: 4,
    unlockThreshold: 60,
    exercises: [
      { id: "b1u4-h1", skill: "hoeren", type: "mcq", prompt: "What is the man looking for?", options: ["A 2-room flat with balcony", "A house with garden", "A shared room"], answer: "A 2-room flat with balcony", audioText: "Ich suche eine Zwei-Zimmer-Wohnung mit Balkon.", transcript: "Ich suche eine Zwei-Zimmer-Wohnung mit Balkon." },
      { id: "b1u4-r1", skill: "lesen", type: "mcq", prompt: "An ad says 'WG-Zimmer frei ab 1. März'. What is a WG?", options: ["A shared flat", "A hotel", "An office"], answer: "A shared flat", vocab: [{ word: "die WG", definition: "shared flat (Wohngemeinschaft)" }, { word: "die Miete", definition: "the rent" }, { word: "der Umzug", definition: "the move / relocation" }] },
      { id: "b1u4-r2", skill: "lesen", type: "matching", prompt: "Match the housing words.", matchingPairs: [{ left: "die Miete", right: "rent" }, { left: "der Nachbar", right: "neighbour" }, { left: "der Balkon", right: "balcony" }] },
      { id: "b1u4-s1", skill: "schreiben", type: "writing", prompt: "Write a short message to a landlord asking about a flat (3 questions).", modelAnswer: "Sehr geehrter Herr Schmidt, ist die Wohnung noch frei? Wie hoch ist die Miete? Haustiere erlaubt? Mit freundlichen Grüßen" },
      { id: "b1u4-sp1", skill: "sprechen", type: "speaking", prompt: "Describe your dream flat and say why (use 'weil').", modelAnswer: "Meine Traumwohnung hat ..., weil ...", taskType: "free" },
    ],
  },
// B2 units
  {
    id: "b2-u3",
    level: "B2",
    title: "Unit 3: Environment & Responsibility",
    description: "Discuss environmental topics and propose solutions.",
    objective: "You can discuss environmental problems and argue for solutions.",
    recycles: ["passive voice", "connectors", "argumentation"],
    order: 3,
    unlockThreshold: 60,
    exercises: [
      { id: "b2u3-h1", skill: "hoeren", type: "mcq", prompt: "What solution does the speaker support?", options: ["More public transport", "Cheaper petrol", "More motorways"], answer: "More public transport", audioText: "Ich finde, wir sollten viel mehr in den öffentlichen Nahverkehr investieren.", transcript: "Ich finde, wir sollten viel mehr in den öffentlichen Nahverkehr investieren." },
      { id: "b2u3-h2", skill: "hoeren", type: "truefalse", prompt: "The speaker thinks individual actions are useless.", options: ["True", "False"], answer: "False", audioText: "Auch wenn ein Mensch allein wenig bewirkt, zählt jeder Beitrag.", transcript: "Auch wenn ein Mensch allein wenig bewirkt, zählt jeder Beitrag." },
      { id: "b2u3-r1", skill: "lesen", type: "mcq", prompt: "What does 'der Klimawandel' mean?", options: ["Climate change", "Air pollution", "Recycling"], answer: "Climate change", vocab: [{ word: "der Klimawandel", definition: "climate change" }, { word: "die Umwelt", definition: "the environment" }, { word: "der Verbrauch", definition: "consumption" }] },
      { id: "b2u3-r2", skill: "lesen", type: "open", prompt: "Write your opinion: Should cities ban cars in the centre? (2 sentences)", modelAnswer: "Ich bin dafür, weil es die Luft verbessert. Allerdings brauchen wir einen guten Busverkehr." },
      { id: "b2u3-s1", skill: "schreiben", type: "writing", prompt: "Write a forum comment (5 sentences) about reducing plastic waste.", modelAnswer: "Plastikmüll ist ein großes Problem. Einerseits ist Plastik praktisch, andererseits verschmutzt es die Meere. Meiner Meinung nach sollte man Einwegplastik verbieten. Außerdem sollten Hersteller Alternativen anbieten. Jeder kann im Alltag einen Beitrag leisten." },
      { id: "b2u3-sp1", skill: "sprechen", type: "speaking", prompt: "Present your view: What should your city do for the environment?", modelAnswer: "Meiner Ansicht nach sollte die Stadt ... , weil ...", taskType: "questions", timeLimit: 60 },
    ],
  },
  {
    id: "b2-u4",
    level: "B2",
    title: "Unit 4: Culture & Communication Styles",
    description: "Talk about cultural differences and misunderstandings.",
    objective: "You can discuss cultural differences politely and handle misunderstandings.",
    recycles: ["relative clauses", "Konjunktiv II", "argumentation"],
    order: 4,
    unlockThreshold: 60,
    exercises: [
      { id: "b2u4-h1", skill: "hoeren", type: "mcq", prompt: "Why was the misunderstanding?", options: ["Directness was taken as rudeness", "Wrong address", "Wrong time"], answer: "Directness was taken as rudeness", audioText: "Sie hat es sehr direkt gesagt, aber es war nicht unhöflich gemeint.", transcript: "Sie hat es sehr direkt gesagt, aber es war nicht unhöflich gemeint." },
      { id: "b2u4-r1", skill: "lesen", type: "truefalse", prompt: "The text says small talk is common in German business meetings.", options: ["True", "False"], answer: "False" },
      { id: "b2u4-r2", skill: "lesen", type: "mcq", prompt: "What does 'die Höflichkeit' mean?", options: ["Politeness", "Punctuality", "Honesty"], answer: "Politeness", vocab: [{ word: "die Höflichkeit", definition: "politeness" }, { word: "das Missverständnis", definition: "the misunderstanding" }, { word: "der small talk", definition: "casual conversation" }] },
      { id: "b2u4-s1", skill: "schreiben", type: "writing", prompt: "Write a short text about a cultural difference you experienced (4-5 sentences).", modelAnswer: "In meinem Heimatland ist es üblich, dass ... In Deutschland hingegen ... Am Anfang fand ich das ungewohnt, inzwischen verstehe ich, dass es respektvoll gemeint ist." },
      { id: "b2u4-sp1", skill: "sprechen", type: "speaking", prompt: "Role-play: politely disagree with a colleague's idea.", modelAnswer: "Ich verstehe deinen Punkt, allerdings sehe ich das etwas anders, weil ...", taskType: "roleplay" },
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