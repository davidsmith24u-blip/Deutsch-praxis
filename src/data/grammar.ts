export interface GrammarTopic {
  id: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  summary: string;
  rules: string[];
  examples: { de: string; en: string }[];
  pitfalls?: string[];
}

export const GRAMMAR: GrammarTopic[] = [
  // A1
  {
    id: "a1-nominativ",
    level: "A1",
    title: "Nominativ (Subject case)",
    summary: "The subject of a sentence is in the nominative case. Articles: der/die/das for definite, ein/eine for indefinite.",
    rules: [
      "Masculine: der / ein",
      "Feminine: die / eine",
      "Neuter: das / ein",
      "Plural: die / — (no indefinite article)",
    ],
    examples: [
      { de: "Der Mann ist alt.", en: "The man is old." },
      { de: "Eine Frau liest.", en: "A woman reads." },
      { de: "Das Kind spielt.", en: "The child plays." },
      { de: "Die Kinder spielen.", en: "The children play." },
    ],
  },
  {
    id: "a1-verb-position",
    level: "A1",
    title: "Verb position in main clauses",
    summary: "In a German statement, the conjugated verb is always in second position (V2). The subject can come before or after.",
    rules: [
      "Subject + Verb + rest: Ich lerne Deutsch.",
      "Time/Place + Verb + Subject: Heute lerne ich Deutsch.",
      "Yes/No questions: Verb + Subject + rest: Lernst du Deutsch?",
    ],
    examples: [
      { de: "Ich wohne in Berlin.", en: "I live in Berlin." },
      { de: "Morgen gehe ich ins Kino.", en: "Tomorrow I'm going to the cinema." },
      { de: "Kommst du mit?", en: "Are you coming along?" },
    ],
  },
  {
    id: "a1-sein-haben",
    level: "A1",
    title: "sein & haben (to be / to have)",
    summary: "The two most important verbs. sein = to be, haben = to have. Irregular conjugation.",
    rules: [
      "sein: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind",
      "haben: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben",
    ],
    examples: [
      { de: "Ich bin müde.", en: "I'm tired." },
      { de: "Du hast einen Hund.", en: "You have a dog." },
      { de: "Wir sind aus Spanien.", en: "We're from Spain." },
    ],
  },
  {
    id: "a1-akkusativ",
    level: "A1",
    title: "Akkusativ (Direct object case)",
    summary: "The direct object — what receives the action — takes the accusative case. Only masculine articles change: der→den, ein→einen.",
    rules: [
      "Masculine: den / einen",
      "Feminine: die / eine (unchanged)",
      "Neuter: das / ein (unchanged)",
      "Plural: die (unchanged)",
    ],
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man." },
      { de: "Sie kauft einen Apfel.", en: "She buys an apple." },
      { de: "Wir haben die Tickets.", en: "We have the tickets." },
    ],
    pitfalls: ["Only masculine changes! Many learners change feminine/neuter too."],
  },
  {
    id: "a1-modal-verbs",
    level: "A1",
    title: "Modal verbs (können, müssen, wollen, sollen, dürfen, mögen)",
    summary: "Modal verbs express ability, obligation, wish, permission. The modal is conjugated; the main verb goes to the end as infinitive.",
    rules: [
      "Modal verb in position 2 (conjugated)",
      "Main verb as infinitive at the end of the clause",
      "No 'zu' before the infinitive",
    ],
    examples: [
      { de: "Ich kann Deutsch sprechen.", en: "I can speak German." },
      { de: "Du musst arbeiten.", en: "You must work." },
      { de: "Wir wollen ins Kino gehen.", en: "We want to go to the cinema." },
    ],
  },
  {
    id: "a1-w-question",
    level: "A1",
    title: "W-questions (wer, was, wo, wann, warum, wie)",
    summary: "Questions with question words: the conjugated verb comes in second position, after the question word.",
    rules: [
      "Question word + Verb + Subject + rest",
      "wo = where (location), wohin = where to (direction), woher = where from",
    ],
    examples: [
      { de: "Wer bist du?", en: "Who are you?" },
      { de: "Wo wohnst du?", en: "Where do you live?" },
      { de: "Wann beginnt der Kurs?", en: "When does the course start?" },
    ],
  },
  // A2
  {
    id: "a2-perfekt",
    level: "A2",
    title: "Perfekt (Present perfect)",
    summary: "The Perfekt is the standard past tense in spoken German. Formed with haben/sein + past participle (Partizip II).",
    rules: [
      "haben + Partizip II: Ich habe gespielt.",
      "sein + Partizip II: for motion/change of state — Ich bin gegangen.",
      "Participle formation: ge- + stem + -t (weak) or ge- + stem + -en (strong)",
      "Separable verbs: prefix + ge + stem — aufgestanden",
    ],
    examples: [
      { de: "Ich habe einen Film gesehen.", en: "I watched a film." },
      { de: "Wir sind nach Berlin gefahren.", en: "We went to Berlin." },
      { de: "Sie hat das Buch gelesen.", en: "She read the book." },
    ],
    pitfalls: ["Motion verbs use sein, not haben: gehen, fahren, fliegen, kommen."],
  },
  {
    id: "a2-dativ",
    level: "A2",
    title: "Dativ (Indirect object case)",
    summary: "The indirect object — to/for whom something is done — takes the dative case.",
    rules: [
      "Masculine: dem / einem",
      "Feminine: der / einer",
      "Neuter: dem / einem",
      "Plural: den + -n (den Kindern)",
    ],
    examples: [
      { de: "Ich gebe dem Mann das Buch.", en: "I give the book to the man." },
      { de: "Sie hilft der Frau.", en: "She helps the woman." },
      { de: "Wir danken den Kindern.", en: "We thank the children." },
    ],
  },
  {
    id: "a2-dative-prepositions",
    level: "A2",
    title: "Dative prepositions",
    summary: "These prepositions always take the dative: aus, bei, mit, nach, seit, von, zu, gegenüber.",
    rules: ["Preposition + dative article", "Contractions: zu dem → zum, zu der → zur, bei dem → beim"],
    examples: [
      { de: "Ich fahre mit dem Zug.", en: "I travel by train." },
      { de: "Er kommt aus der Türkei.", en: "He's from Turkey." },
      { de: "Seit einem Jahr lerne ich Deutsch.", en: "I've been learning German for a year." },
    ],
  },
  {
    id: "a2-akk-dativ-prepositions",
    level: "A2",
    title: "Two-way prepositions (Wechselpräpositionen)",
    summary: "in, an, auf, über, vor, hinter, neben, unter, zwischen take dative (location) or accusative (direction).",
    rules: [
      "Wo? (where, static) → dative",
      "Wohin? (where to, movement) → accusative",
      "Woher? (where from) → dative (with aus/von)",
    ],
    examples: [
      { de: "Das Buch liegt auf dem Tisch. (Wo?)", en: "The book is on the table." },
      { de: "Ich lege das Buch auf den Tisch. (Wohin?)", en: "I put the book on the table." },
    ],
  },
  {
    id: "a2-komparativ",
    level: "A2",
    title: "Comparative & superlative",
    summary: "Comparing things: adjective + -er (comparative), am + adjective + -sten (superlative).",
    rules: [
      "Comparative: schön → schöner, teuer → teurer",
      "Superlative: am schönsten, am teuersten",
      "Irregular: gut → besser → am besten; viel → mehr → am meisten",
    ],
    examples: [
      { de: "Berlin ist größer als München.", en: "Berlin is bigger than Munich." },
      { de: "Das ist das beste Restaurant.", en: "That's the best restaurant." },
    ],
  },
  // B1
  {
    id: "b1-präteritum",
    level: "B1",
    title: "Präteritum (Simple past)",
    summary: "Used in written German and for modal/auxiliary verbs in speech. Regular: stem + -te; strong verbs have vowel change.",
    rules: [
      "Weak verbs: spielen → spielte, spieltest, spielte, spielten, spieltet, spielten",
      "Strong verbs: gehen → ging, kommen → kam, sehen → sah",
      "Modals & sein/haben/werden always use Präteritum in speech: war, hatte, wurde",
    ],
    examples: [
      { de: "Gestern spielte ich Fußball.", en: "Yesterday I played football." },
      { de: "Er war in Berlin.", en: "He was in Berlin." },
      { de: "Sie hatte keine Zeit.", en: "She had no time." },
    ],
  },
  {
    id: "b1-nebensatz",
    level: "B1",
    title: "Subordinate clauses (weil, dass, wenn, obwohl)",
    summary: "In subordinate clauses introduced by conjunctions, the conjugated verb goes to the end.",
    rules: [
      "Main clause + conjunction + subject + ... + verb (end)",
      "Key conjunctions: weil, dass, wenn, obwohl, ob, als, bevor, nachdem, damit",
      "Comma separates main and subordinate clause",
    ],
    examples: [
      { de: "Ich bleibe zu Hause, weil ich krank bin.", en: "I'm staying home because I'm sick." },
      { de: "Er sagt, dass er kommt.", en: "He says that he's coming." },
      { de: "Wenn es regnet, bleibe ich drin.", en: "If it rains, I stay inside." },
    ],
  },
  {
    id: "b1-relativsatz",
    level: "B1",
    title: "Relative clauses",
    summary: "Relative clauses add information about a noun. Relative pronouns decline like definite articles (der/die/das + endings).",
    rules: [
      "Relative pronoun agrees with the noun it refers to (gender/number)",
      "Case depends on the pronoun's role in the relative clause",
      "Verb goes to the end of the relative clause",
    ],
    examples: [
      { de: "Der Mann, der dort steht, ist mein Lehrer.", en: "The man standing there is my teacher." },
      { de: "Das Buch, das ich lese, ist spannend.", en: "The book I'm reading is exciting." },
    ],
  },
  {
    id: "b1-passiv",
    level: "B1",
    title: "Passive voice (Vorgangspassiv)",
    summary: "Focus on the action, not the doer. Formed with werden + Partizip II.",
    rules: [
      "werden (conjugated) + Partizip II at the end",
      "Agent with 'von + dative' if mentioned",
      "Tense of werden determines tense of passive",
    ],
    examples: [
      { de: "Das Haus wird gebaut.", en: "The house is being built." },
      { de: "Der Brief wurde geschrieben.", en: "The letter was written." },
      { de: "Das Auto ist von ihm repariert worden.", en: "The car was repaired by him." },
    ],
  },
  {
    id: "b1-konjunktiv2",
    level: "B1",
    title: "Konjunktiv II (Subjunctive II)",
    summary: "Used for wishes, hypotheticals, and polite requests. Based on Präteritum stem + -e endings (or würde + infinitive).",
    rules: [
      "würde + infinitive: common for most verbs",
      "Irregular forms for key verbs: wäre, hätte, könnte, sollte, müsste",
      "Polite requests: Könnten Sie...? Würden Sie...?",
    ],
    examples: [
      { de: "Wenn ich reich wäre, würde ich reisen.", en: "If I were rich, I'd travel." },
      { de: "Könnten Sie mir helfen?", en: "Could you help me?" },
      { de: "Ich hätte gern einen Kaffee.", en: "I'd like a coffee." },
    ],
  },
  // B2
  {
    id: "b2-genitiv",
    level: "B2",
    title: "Genitiv (Possessive case)",
    summary: "Shows possession or relationship. Used with certain prepositions and in formal writing.",
    rules: [
      "Masculine/Neuter: des + -s/-es (des Mannes, des Kindes)",
      "Feminine/Plural: der (der Frau, der Kinder)",
      "Genitive prepositions: wegen, trotz, während, statt/anstatt, innerhalb, außerhalb",
    ],
    examples: [
      { de: "Das Auto des Mannes ist neu.", en: "The man's car is new." },
      { de: "Wegen des Wetters bleiben wir zu Hause.", en: "Because of the weather we stay home." },
      { de: "Trotz der Kälte gehen wir raus.", en: "Despite the cold we go out." },
    ],
  },
  {
    id: "b2-partizipialattribute",
    level: "B2",
    title: "Participle attributes (Partizipialattribute)",
    summary: "Participles used as adjectives before nouns, very common in written German for compact information.",
    rules: [
      "Partizip I (active): lachend → die lachende Frau",
      "Partizip II (passive/completed): gelesen → das gelesene Buch",
      "Declines like adjectives",
    ],
    examples: [
      { de: "Die schlafende Katze liegt auf dem Sofa.", en: "The sleeping cat lies on the sofa." },
      { de: "Das geschriebene Wort bleibt.", en: "The written word remains." },
    ],
  },
  {
    id: "b2-nominalisierung",
    level: "B2",
    title: "Nominalization (Substantivierung)",
    summary: "Turning verbs/adjectives into nouns. Very common in formal/academic German for compactness.",
    rules: [
      "Infinitive as noun: das Lesen, das Schwimmen (neuter)",
      "Adjective as noun: der Alte, die Schöne",
      "Participle as noun: der Reisende, die Angestellte",
    ],
    examples: [
      { de: "Das Lesen macht Spaß.", en: "Reading is fun." },
      { de: "Der Reisende wartet.", en: "The traveler waits." },
    ],
  },
  {
    id: "b2-konjunktiv1",
    level: "B2",
    title: "Konjunktiv I (Indirect speech)",
    summary: "Used for reported speech, especially in journalism. Based on infinitive stem + endings.",
    rules: [
      "Formation: stem + -e, -est, -e, -en, -et, -en",
      "Most common: sei (sein), habe (haben), werde (werden)",
      "Signals that the speaker is reporting, not endorsing",
    ],
    examples: [
      { de: "Er sagte, er sei krank.", en: "He said he was sick." },
      { de: "Sie meint, sie habe recht.", en: "She claims she's right." },
    ],
  },
  // C1
  {
    id: "c1-advanced-passive",
    level: "C1",
    title: "Advanced passive (Zustandspassiv, Passiversatz)",
    summary: "Beyond Vorgangspassiv: Zustandspassiv (state resulting from action) and alternatives like sein + zu + infinitive.",
    rules: [
      "Zustandspassiv: sein + Partizip II (Das Fenster ist geöffnet.)",
      "Passiversatz: sein + zu + Infinitiv (Das ist zu machen. = Das kann gemacht werden.)",
      "lassen + Infinitiv as passive substitute: Das lässt sich machen.",
    ],
    examples: [
      { de: "Die Tür ist geschlossen.", en: "The door is closed (state)." },
      { de: "Das Problem ist zu lösen.", en: "The problem can be solved." },
      { de: "Das lässt sich nicht ändern.", en: "That can't be changed." },
    ],
  },
  {
    id: "c1-hedging",
    level: "C1",
    title: "Hedging & modal particles",
    summary: "Modal particles (doch, ja, wohl, vielleicht, eben) add nuance and attitude. Hedging softens claims.",
    rules: [
      "doch: emphasizes, contradicts (Das ist doch klar!)",
      "ja: obvious/shared knowledge (Das ist ja interessant.)",
      "wohl: supposition (Er wird wohl kommen.)",
      "eben/nun mal: acceptance (Das ist eben so.)",
    ],
    examples: [
      { de: "Das ist doch offensichtlich.", en: "That's obvious (as you know). " },
      { de: "Er wird wohl zu spät kommen.", en: "He'll probably be late." },
    ],
  },
  // C2
  {
    id: "c2-stilistik",
    level: "C2",
    title: "Stylistics & register",
    summary: "C2 mastery: choosing the right register, stylistic devices, and rhetorical precision for any context.",
    rules: [
      "Register levels: Umgangssprache, Alltagssprache, Standardsprache, Fachsprache, Amtssprache",
      "Stylistic devices: Metapher, Ironie, Hyperbel, Euphemismus, Litotes",
      "Syntax variation: Inversion, fronting (Topikalisierung), cleft sentences",
    ],
    examples: [
      { de: "Nicht wenige (Litotes) = viele", en: "Not few = many (understatement)" },
      { de: "Er ist ein Löwe im Kampf (Metapher).", en: "He's a lion in battle (metaphor)." },
    ],
  },
  {
    id: "c2-konjunktiv-nuance",
    level: "C2",
    title: "Konjunktiv nuance & irrealis",
    summary: "Fine-grained use of subjunctive for counterfactuals, unreal conditions, and distancing.",
    rules: [
      "Irrealis past: hätte + Partizip II (Hätte ich das gewusst, ...)",
      "Irrealis present: wäre/könnte/würde (Wäre er hier, ...)",
      "Distancing in reported speech: Konjunktiv I vs II choice",
    ],
    examples: [
      { de: "Hätte ich das gewusst, hätte ich anders gehandelt.", en: "Had I known, I'd have acted differently." },
      { de: "Wäre er rechtzeitig gekommen, wäre alles gut gegangen.", en: "Had he come on time, everything would've been fine." },
    ],
  },
];

export function grammarByLevel(level: string) {
  return GRAMMAR.filter((g) => g.level === level);
}

export function getGrammar(id: string) {
  return GRAMMAR.find((g) => g.id === id);
}
