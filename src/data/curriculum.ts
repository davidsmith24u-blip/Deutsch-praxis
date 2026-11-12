export type LevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface VocabItem {
  word: string;
  translation: string;
  example?: string;
}

export interface GrammarBlock {
  title: string;
  explanation: string;
  examples: { de: string; en: string }[];
}

export interface Exercise {
  id: string;
  type: "mcq" | "fill" | "build";
  prompt: string;
  options?: string[];
  answer: string;
  hint?: string;
}

export interface Lesson {
  slug: string;
  level: LevelCode;
  title: string;
  summary: string;
  order: number;
  grammar: GrammarBlock[];
  vocabulary: VocabItem[];
  exercises: Exercise[];
}

export interface Scenario {
  id: string;
  level: LevelCode;
  title: string;
  description: string;
  systemPrompt: string;
  starter: string;
}

export const LEVELS: { code: LevelCode; title: string; description: string; order: number }[] = [
  { code: "A1", title: "A1 — Beginner", description: "First steps: greetings, personal info, basic verbs.", order: 1 },
  { code: "A2", title: "A2 — Elementary", description: "Daily routines, past tense, modals.", order: 2 },
  { code: "B1", title: "B1 — Intermediate", description: "Subordinate clauses, opinions, travel & work.", order: 3 },
  { code: "B2", title: "B2 — Upper Intermediate", description: "Complex grammar, argumentation, professional topics.", order: 4 },
  { code: "C1", title: "C1 — Advanced", description: "Academic texts, negotiations, abstract argumentation.", order: 5 },
  { code: "C2", title: "C2 — Mastery", description: "Nuance, style, register, high-stakes communication.", order: 6 },
];

export const LESSONS: Lesson[] = [
  {
    slug: "a1-greetings",
    level: "A1",
    title: "Greetings & Introductions",
    summary: "Say hello, introduce yourself, and ask basic questions.",
    order: 1,
    grammar: [
      {
        title: "Personal pronouns",
        explanation: "ich (I), du (you informal), er/sie/es (he/she/it), wir (we), ihr (you pl.), sie/Sie (they/you formal).",
        examples: [
          { de: "Ich heiße Anna.", en: "My name is Anna." },
          { de: "Wie heißt du?", en: "What is your name?" },
        ],
      },
      {
        title: "Verb 'heißen' (to be called)",
        explanation: "heißen is a regular verb: ich heiße, du heißt, er/sie/es heißt.",
        examples: [
          { de: "Er heißt Tom.", en: "His name is Tom." },
          { de: "Wie heißen Sie?", en: "What is your name? (formal)" },
        ],
      },
    ],
    vocabulary: [
      { word: "Hallo", translation: "hello", example: "Hallo! Wie geht's?" },
      { word: "Guten Morgen", translation: "good morning" },
      { word: "Guten Tag", translation: "good day" },
      { word: "Guten Abend", translation: "good evening" },
      { word: "Auf Wiedersehen", translation: "goodbye" },
      { word: "Danke", translation: "thank you" },
      { word: "Bitte", translation: "please / you're welcome" },
    ],
    exercises: [
      { id: "a1g1", type: "mcq", prompt: "How do you say 'Good morning' in German?", options: ["Guten Abend", "Guten Morgen", "Gute Nacht", "Hallo"], answer: "Guten Morgen" },
      { id: "a1g2", type: "fill", prompt: "Complete: Ich ___ Anna. (heißen)", answer: "heiße", hint: "ich form" },
      { id: "a1g3", type: "mcq", prompt: "Formal 'What is your name?'", options: ["Wie heißt du?", "Wie heißen Sie?", "Wer bist du?"], answer: "Wie heißen Sie?" },
    ],
  },
  {
    slug: "a1-personal-info",
    level: "A1",
    title: "Personal Information",
    summary: "Talk about where you live, your job, and your age.",
    order: 2,
    grammar: [
      {
        title: "Verb 'sein' (to be)",
        explanation: "sein is irregular: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
        examples: [
          { de: "Ich bin 25 Jahre alt.", en: "I am 25 years old." },
          { de: "Woher kommst du?", en: "Where are you from?" },
        ],
      },
      {
        title: "Verb 'kommen' (to come)",
        explanation: "kommen: ich komme, du kommst, er/sie/es kommt.",
        examples: [
          { de: "Ich komme aus Deutschland.", en: "I come from Germany." },
        ],
      },
    ],
    vocabulary: [
      { word: "wohnen", translation: "to live", example: "Ich wohne in Berlin." },
      { word: "arbeiten", translation: "to work" },
      { word: "Student/in", translation: "student" },
      { word: "Lehrer/in", translation: "teacher" },
      { word: "Jahre alt", translation: "years old" },
    ],
    exercises: [
      { id: "a1p1", type: "fill", prompt: "Ich ___ aus Spanien. (kommen, ich)", answer: "komme" },
      { id: "a1p2", type: "mcq", prompt: "Correct form: 'She is from Austria'", options: ["Sie ist aus Österreich.", "Sie bin aus Österreich.", "Sie bist aus Österreich."], answer: "Sie ist aus Österreich." },
      { id: "a1p3", type: "build", prompt: "Build: I live in Munich.", answer: "Ich wohne in München." },
    ],
  },
  {
    slug: "a1-numbers",
    level: "A1",
    title: "Numbers & Time",
    summary: "Count, tell the time, and state dates.",
    order: 3,
    grammar: [
      {
        title: "Numbers 1–20",
        explanation: "eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf, dreizehn...",
        examples: [
          { de: "Ich habe zwei Geschwister.", en: "I have two siblings." },
        ],
      },
      {
        title: "Telling time",
        explanation: "Wie spät ist es? — Es ist ... Uhr. Half past: halb.",
        examples: [
          { de: "Es ist halb drei.", en: "It's 2:30." },
        ],
      },
    ],
    vocabulary: [
      { word: "Uhr", translation: "o'clock / clock" },
      { word: "halb", translation: "half" },
      { word: "Viertel", translation: "quarter" },
      { word: "Minute", translation: "minute" },
    ],
    exercises: [
      { id: "a1n1", type: "mcq", prompt: "How do you say 7?", options: ["sechs", "sieben", "acht"], answer: "sieben" },
      { id: "a1n2", type: "fill", prompt: "Es ist ___ acht. (half past seven? no — 7:30)", answer: "halb" },
    ],
  },
  {
    slug: "a1-verbs-sein-haben",
    level: "A1",
    title: "Verbs sein & haben",
    summary: "Master the two most important German verbs.",
    order: 4,
    grammar: [
      {
        title: "sein (to be)",
        explanation: "ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
        examples: [{ de: "Wir sind glücklich.", en: "We are happy." }],
      },
      {
        title: "haben (to have)",
        explanation: "ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben.",
        examples: [{ de: "Ich habe ein Auto.", en: "I have a car." }],
      },
    ],
    vocabulary: [
      { word: "glücklich", translation: "happy" },
      { word: "müde", translation: "tired" },
      { word: "Hunger", translation: "hunger (Ich habe Hunger.)" },
      { word: "Durst", translation: "thirst" },
    ],
    exercises: [
      { id: "a1v1", type: "fill", prompt: "Ich ___ müde. (sein)", answer: "bin" },
      { id: "a1v2", type: "fill", prompt: "Du ___ ein Buch. (haben)", answer: "hast" },
      { id: "a1v3", type: "mcq", prompt: "Correct: 'They have time'", options: ["Sie haben Zeit.", "Sie hat Zeit.", "Sie habt Zeit."], answer: "Sie haben Zeit." },
    ],
  },
  {
    slug: "a1-articles",
    level: "A1",
    title: "Articles (der, die, das)",
    summary: "Learn definite and indefinite articles.",
    order: 5,
    grammar: [
      {
        title: "Definite articles",
        explanation: "Masculine der, feminine die, neuter das, plural die.",
        examples: [
          { de: "der Mann, die Frau, das Kind", en: "the man, the woman, the child" },
        ],
      },
      {
        title: "Indefinite articles",
        explanation: "ein (m/n), eine (f).",
        examples: [{ de: "Ich habe einen Hund.", en: "I have a dog." }],
      },
    ],
    vocabulary: [
      { word: "der Tisch", translation: "table (m)" },
      { word: "die Tür", translation: "door (f)" },
      { word: "das Buch", translation: "book (n)" },
      { word: "die Kinder", translation: "children (pl)" },
    ],
    exercises: [
      { id: "a1a1", type: "mcq", prompt: "Article for 'Frau'?", options: ["der", "die", "das"], answer: "die" },
      { id: "a1a2", type: "mcq", prompt: "Article for 'Buch'?", options: ["der", "die", "das"], answer: "das" },
      { id: "a1a3", type: "fill", prompt: "Ich habe ___ Hund. (a dog)", answer: "einen" },
    ],
  },
  {
    slug: "a1-simple-present",
    level: "A1",
    title: "Simple Present Tense",
    summary: "Describe routines and habits.",
    order: 6,
    grammar: [
      {
        title: "Regular verbs present",
        explanation: "stem + endings: -e, -st, -t, -en, -t, -en.",
        examples: [
          { de: "Ich lerne Deutsch.", en: "I learn German." },
          { de: "Du spielst Fußball.", en: "You play football." },
        ],
      },
    ],
    vocabulary: [
      { word: "lernen", translation: "to learn" },
      { word: "spielen", translation: "to play" },
      { word: "arbeiten", translation: "to work" },
      { word: "wohnen", translation: "to live" },
    ],
    exercises: [
      { id: "a1s1", type: "fill", prompt: "Ich ___ Deutsch. (lernen)", answer: "lerne" },
      { id: "a1s2", type: "fill", prompt: "Er ___ Fußball. (spielen)", answer: "spielt" },
    ],
  },
  {
    slug: "a2-daily-routines",
    level: "A2",
    title: "Daily Routines",
    summary: "Describe a typical day using reflexive verbs.",
    order: 1,
    grammar: [
      {
        title: "Reflexive verbs",
        explanation: "sich anziehen, sich waschen: ich wasche mich, du wäschst dich.",
        examples: [{ de: "Ich stehe um 7 Uhr auf.", en: "I get up at 7." }],
      },
      {
        title: "Time expressions",
        explanation: "am Morgen, am Nachmittag, am Abend, zuerst, dann, danach.",
        examples: [{ de: "Zuerst frühstücke ich, dann gehe ich zur Arbeit.", en: "First I eat breakfast, then I go to work." }],
      },
    ],
    vocabulary: [
      { word: "aufstehen", translation: "to get up" },
      { word: "frühstücken", translation: "to eat breakfast" },
      { word: "einkaufen", translation: "to shop" },
      { word: "fernsehen", translation: "to watch TV" },
    ],
    exercises: [
      { id: "a2d1", type: "fill", prompt: "Ich ___ mich. (waschen, ich)", answer: "wasche" },
      { id: "a2d2", type: "mcq", prompt: "Meaning of 'einkaufen'?", options: ["to eat", "to shop", "to sleep"], answer: "to shop" },
    ],
  },
  {
    slug: "a2-perfekt",
    level: "A2",
    title: "Past Tense (Perfekt)",
    summary: "Talk about completed events.",
    order: 2,
    grammar: [
      {
        title: "Perfekt with haben",
        explanation: "haben + past participle (ge- + stem + -t).",
        examples: [{ de: "Ich habe Deutsch gelernt.", en: "I learned German." }],
      },
      {
        title: "Perfekt with sein",
        explanation: "Motion/change of state uses sein: ich bin gegangen.",
        examples: [{ de: "Wir sind nach Berlin gefahren.", en: "We drove to Berlin." }],
      },
    ],
    vocabulary: [
      { word: "machen", translation: "to do/make", example: "Ich habe das gemacht." },
      { word: "gehen", translation: "to go" },
      { word: "kommen", translation: "to come" },
      { word: "sehen", translation: "to see" },
    ],
    exercises: [
      { id: "a2p1", type: "fill", prompt: "Ich habe einen Film ___. (sehen)", answer: "gesehen" },
      { id: "a2p2", type: "mcq", prompt: "Auxiliary for 'gehen'?", options: ["haben", "sein"], answer: "sein" },
    ],
  },
  {
    slug: "a2-modals",
    level: "A2",
    title: "Modal Verbs",
    summary: "Express ability, permission, and obligation.",
    order: 3,
    grammar: [
      {
        title: "Modals",
        explanation: "können, müssen, dürfen, sollen, wollen, mögen. Modal in 2nd position, infinitive at end.",
        examples: [{ de: "Ich kann Deutsch sprechen.", en: "I can speak German." }],
      },
    ],
    vocabulary: [
      { word: "können", translation: "can" },
      { word: "müssen", translation: "must" },
      { word: "dürfen", translation: "may/allowed" },
      { word: "wollen", translation: "want" },
    ],
    exercises: [
      { id: "a2m1", type: "fill", prompt: "Ich ___ Deutsch sprechen. (can)", answer: "kann" },
      { id: "a2m2", type: "build", prompt: "Build: You must work.", answer: "Du musst arbeiten." },
    ],
  },
  {
    slug: "a2-dative",
    level: "A2",
    title: "Dative Case",
    summary: "Use dative with prepositions and indirect objects.",
    order: 4,
    grammar: [
      {
        title: "Dative articles",
        explanation: "dem (m/n), der (f), den (pl).",
        examples: [{ de: "Ich gebe dem Mann das Buch.", en: "I give the man the book." }],
      },
      {
        title: "Dative prepositions",
        explanation: "aus, bei, mit, nach, seit, von, zu always take dative.",
        examples: [{ de: "Ich fahre mit dem Bus.", en: "I travel by bus." }],
      },
    ],
    vocabulary: [
      { word: "geben", translation: "to give" },
      { word: "helfen", translation: "to help" },
      { word: "danken", translation: "to thank" },
    ],
    exercises: [
      { id: "a2da1", type: "mcq", prompt: "Dative article for feminine?", options: ["dem", "der", "den"], answer: "der" },
      { id: "a2da2", type: "fill", prompt: "Ich fahre mit ___ Zug. (the train, m)", answer: "dem" },
    ],
  },
  {
    slug: "a2-comparisons",
    level: "A2",
    title: "Comparisons",
    summary: "Compare things using -er and am ...sten.",
    order: 5,
    grammar: [
      {
        title: "Comparative",
        explanation: "Add -er: größer, schneller. Use als for 'than'.",
        examples: [{ de: "Berlin ist größer als München.", en: "Berlin is bigger than Munich." }],
      },
      {
        title: "Superlative",
        explanation: "am + adjective + -sten: am größten.",
        examples: [{ de: "Der Mount Everest ist am höchsten.", en: "Everest is the highest." }],
      },
    ],
    vocabulary: [
      { word: "groß", translation: "big" },
      { word: "klein", translation: "small" },
      { word: "schnell", translation: "fast" },
      { word: "langsam", translation: "slow" },
    ],
    exercises: [
      { id: "a2c1", type: "fill", prompt: "Berlin ist ___ als München. (big)", answer: "größer" },
      { id: "a2c2", type: "mcq", prompt: "Superlative of 'schnell'?", options: ["am schnellsten", "schneller", "am schnellere"], answer: "am schnellsten" },
    ],
  },
  {
    slug: "b1-subordinate",
    level: "B1",
    title: "Subordinate Clauses (weil, dass)",
    summary: "Connect ideas with subordinate clauses.",
    order: 1,
    grammar: [
      {
        title: "weil / dass",
        explanation: "In subordinate clauses the conjugated verb goes to the end.",
        examples: [{ de: "Ich bleibe zu Hause, weil ich krank bin.", en: "I stay home because I am sick." }],
      },
    ],
    vocabulary: [
      { word: "weil", translation: "because" },
      { word: "dass", translation: "that" },
      { word: "obwohl", translation: "although" },
    ],
    exercises: [
      { id: "b1s1", type: "build", prompt: "Build: I think that German is beautiful.", answer: "Ich denke, dass Deutsch schön ist." },
    ],
  },
  {
    slug: "b1-konjunktiv",
    level: "B1",
    title: "Konjunktiv II (würde, wäre, hätte)",
    summary: "Express wishes and hypothetical situations.",
    order: 2,
    grammar: [
      {
        title: "Konjunktiv II",
        explanation: "würde + infinitive for most verbs; wäre/hätte for sein/haben.",
        examples: [{ de: "Wenn ich Zeit hätte, würde ich reisen.", en: "If I had time, I would travel." }],
      },
    ],
    vocabulary: [
      { word: "wenn", translation: "if" },
      { word: "träumen", translation: "to dream" },
    ],
    exercises: [
      { id: "b1k1", type: "fill", prompt: "Wenn ich reich ___, würde ich ein Haus kaufen. (sein, Konj. II)", answer: "wäre" },
    ],
  },
  {
    slug: "b1-passive",
    level: "B1",
    title: "Passive Voice",
    summary: "Focus on the action rather than the actor.",
    order: 3,
    grammar: [
      {
        title: "Passive (werden + Partizip II)",
        explanation: "Das Haus wird gebaut. (The house is being built.)",
        examples: [{ de: "Das Auto wurde repariert.", en: "The car was repaired." }],
      },
    ],
    vocabulary: [
      { word: "reparieren", translation: "to repair" },
      { word: "bauen", translation: "to build" },
    ],
    exercises: [
      { id: "b1p1", type: "mcq", prompt: "Passive auxiliary?", options: ["haben", "werden", "sein"], answer: "werden" },
    ],
  },
  {
    slug: "b1-opinions",
    level: "B1",
    title: "Expressing Opinions",
    summary: "Agree, disagree, and justify your views.",
    order: 4,
    grammar: [
      {
        title: "Opinion phrases",
        explanation: "Ich finde, dass... / Meiner Meinung nach... / Ich bin der Meinung, dass...",
        examples: [{ de: "Ich finde, dass Deutsch wichtig ist.", en: "I think German is important." }],
      },
    ],
    vocabulary: [
      { word: "Meinung", translation: "opinion" },
      { word: "zustimmen", translation: "to agree" },
      { word: "ablehnen", translation: "to reject" },
    ],
    exercises: [
      { id: "b1o1", type: "build", prompt: "Build: In my opinion, learning languages is fun.", answer: "Meiner Meinung nach macht Sprachenlernen Spaß." },
    ],
  },
  {
    slug: "b2-relative",
    level: "B2",
    title: "Relative Clauses",
    summary: "Add detail with relative clauses.",
    order: 1,
    grammar: [
      {
        title: "Relative pronouns",
        explanation: "der, die, das, (pl) die; case depends on role in relative clause.",
        examples: [{ de: "Der Mann, der dort steht, ist mein Lehrer.", en: "The man standing there is my teacher." }],
      },
    ],
    vocabulary: [
      { word: "stehen", translation: "to stand" },
      { word: "gehören", translation: "to belong" },
    ],
    exercises: [
      { id: "b2r1", type: "fill", prompt: "Der Mann, ___ dort steht, ist mein Lehrer. (nom, m)", answer: "der" },
    ],
  },
  {
    slug: "b2-connectors",
    level: "B2",
    title: "Advanced Connectors",
    summary: "Use damit, obwohl, während, etc.",
    order: 2,
    grammar: [
      {
        title: "Two-part connectors",
        explanation: "nicht nur ... sondern auch, entweder ... oder, weder ... noch.",
        examples: [{ de: "Ich lerne nicht nur Grammatik, sondern auch Vokabeln.", en: "I learn not only grammar but also vocabulary." }],
      },
    ],
    vocabulary: [
      { word: "obwohl", translation: "although" },
      { word: "während", translation: "while" },
      { word: "damit", translation: "so that" },
    ],
    exercises: [
      { id: "b2c1", type: "build", prompt: "Build: Although it rains, I go out.", answer: "Obwohl es regnet, gehe ich raus." },
    ],
  },
  {
    slug: "b2-argumentation",
    level: "B2",
    title: "Argumentation & Discussion",
    summary: "Structure arguments and discuss abstract topics.",
    order: 3,
    grammar: [
      {
        title: "Argument structure",
        explanation: "Einerseits ... andererseits; Zum einen ... zum anderen; Daher/deswegen.",
        examples: [{ de: "Einerseits ist es teuer, andererseits sehr nützlich.", en: "On one hand it's expensive, on the other very useful." }],
      },
    ],
    vocabulary: [
      { word: "Vorteil", translation: "advantage" },
      { word: "Nachteil", translation: "disadvantage" },
      { word: "folglich", translation: "consequently" },
    ],
    exercises: [
      { id: "b2a1", type: "mcq", prompt: "Meaning of 'Nachteil'?", options: ["advantage", "disadvantage", "opinion"], answer: "disadvantage" },
    ],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "a1-intro",
    level: "A1",
    title: "Introducing Yourself",
    description: "Meet someone new and exchange basic info.",
    systemPrompt: "You are a friendly German speaker meeting a beginner (A1). Speak simple German, ask basic questions about name, origin, age, hobbies. Correct gently. Offer simpler phrasing if needed. Stay in character.",
    starter: "Hallo! Wie heißt du?",
  },
  {
    id: "a1-order-food",
    level: "A1",
    title: "Ordering Food",
    description: "Order a meal at a café.",
    systemPrompt: "You are a waiter in a German café. Speak A1-appropriate German. Help the user order food and drink. Ask simple questions. Correct politely.",
    starter: "Guten Tag! Was möchten Sie bestellen?",
  },
  {
    id: "a1-directions",
    level: "A1",
    title: "Asking for Directions",
    description: "Ask how to get to a place.",
    systemPrompt: "You are a passerby in a German city. Speak A1 German. Give simple directions. Correct gently.",
    starter: "Entschuldigung, wo ist der Bahnhof?",
  },
  {
    id: "a2-hobbies",
    level: "A2",
    title: "Talking About Hobbies",
    description: "Discuss free-time activities.",
    systemPrompt: "You are a friendly German speaker (A2 level). Discuss hobbies, sports, music. Ask follow-up questions. Correct mistakes gently with explanations.",
    starter: "Was machst du gerne in deiner Freizeit?",
  },
  {
    id: "a2-day",
    level: "A2",
    title: "Describing Your Day",
    description: "Talk about daily routines.",
    systemPrompt: "You are a German conversation partner (A2). Ask about the user's day, routines, work/school. Use Perfekt and daily vocab. Correct gently.",
    starter: "Erzähl mir von deinem Tag. Was hast du heute gemacht?",
  },
  {
    id: "a2-job-interview-simple",
    level: "A2",
    title: "Simple Job Interview",
    description: "Basic job interview practice.",
    systemPrompt: "You are an employer interviewing a candidate (A2). Ask simple questions about experience, strengths, availability. Speak clear German. Correct gently.",
    starter: "Warum möchten Sie bei uns arbeiten?",
  },
  {
    id: "b1-experiences",
    level: "B1",
    title: "Discussing Experiences",
    description: "Talk about past experiences and travel.",
    systemPrompt: "You are a German conversation partner (B1). Discuss travel, experiences, opinions. Use subordinate clauses. Correct and explain.",
    starter: "Hast du schon einmal im Ausland gelebt oder gearbeitet?",
  },
  {
    id: "b1-doctor",
    level: "B1",
    title: "At the Doctor",
    description: "Role-play a doctor visit.",
    systemPrompt: "You are a German doctor (B1). Ask about symptoms, give advice. Use medical vocabulary appropriate for B1. Correct gently.",
    starter: "Guten Tag! Was führt Sie heute zu mir?",
  },
  {
    id: "b1-apartment",
    level: "B1",
    title: "Apartment Viewing",
    description: "Role-play viewing an apartment.",
    systemPrompt: "You are a landlord showing an apartment (B1). Describe rooms, rent, conditions. Ask questions. Correct gently.",
    starter: "Willkommen! Möchten Sie die Wohnung besichtigen?",
  },
  {
    id: "b2-job-interview",
    level: "B2",
    title: "Professional Job Interview",
    description: "Advanced job interview.",
    systemPrompt: "You are a hiring manager (B2). Conduct a professional interview: strengths, weaknesses, scenarios, salary. Use advanced vocabulary. Correct and give feedback.",
    starter: "Bitte stellen Sie sich kurz vor und erklären Sie, warum Sie für diese Stelle geeignet sind.",
  },
  {
    id: "b2-news",
    level: "B2",
    title: "Discussing News",
    description: "Discuss current events and opinions.",
    systemPrompt: "You are a German discussion partner (B2). Discuss news, society, technology. Encourage argumentation. Correct and refine.",
    starter: "Haben Sie die Nachrichten heute verfolgt? Was halten Sie von den aktuellen Entwicklungen?",
  },
  {
    id: "b2-argue",
    level: "B2",
    title: "Arguing a Point",
    description: "Defend a position in a debate.",
    systemPrompt: "You are a debate partner (B2). Challenge the user's arguments politely, ask for evidence. Use connectors. Correct and give feedback.",
    starter: "Ich bin der Meinung, dass Homeoffice die Produktivität senkt. Was denken Sie?",
  },
];

export function lessonsByLevel(level: LevelCode) {
  return LESSONS.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
}
export function getLesson(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}
export function scenariosByLevel(level: LevelCode) {
  return SCENARIOS.filter((s) => s.level === level);
}
export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}