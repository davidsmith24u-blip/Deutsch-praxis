import { UNITS } from "@/data/units";

export interface VocabItem {
  word: string;
  definition: string;
  level: string;
  source: string; // "unit:a1-u1" | "wortliste"
}

// Vocabulary collected from every unit's clickable vocab entries.
function vocabFromUnits(): VocabItem[] {
  const items: VocabItem[] = [];
  for (const u of UNITS) {
    for (const ex of u.exercises) {
      for (const v of ex.vocab ?? []) {
        if (v.word && v.definition) {
          items.push({ word: v.word, definition: v.definition, level: u.level, source: `unit:${u.id}` });
        }
      }
    }
  }
  return items;
}

// Starter Wortliste (Goethe-style) — extendable. Focus: high-frequency A1/A2 words.
const WORTLISTE: Array<[string, string, string]> = [
  ["der Bahnhof", "the train station", "A1"],
  ["der Bus", "the bus", "A1"],
  ["das Auto", "the car", "A1"],
  ["das Fahrrad", "the bicycle", "A1"],
  ["die Arbeit", "the work / job", "A1"],
  ["das Büro", "the office", "A1"],
  ["die Schule", "the school", "A1"],
  ["der Lehrer", "the (male) teacher", "A1"],
  ["die Lehrerin", "the (female) teacher", "A1"],
  ["der Student", "the (male) student", "A1"],
  ["das Kind", "the child", "A1"],
  ["die Familie", "the family", "A1"],
  ["der Vater", "the father", "A1"],
  ["die Mutter", "the mother", "A1"],
  ["der Bruder", "the brother", "A1"],
  ["die Schwester", "the sister", "A1"],
  ["der Freund", "the friend", "A1"],
  ["das Haus", "the house", "A1"],
  ["die Wohnung", "the flat / apartment", "A1"],
  ["das Zimmer", "the room", "A1"],
  ["die Küche", "the kitchen", "A1"],
  ["das Bad", "the bathroom", "A1"],
  ["der Tisch", "the table", "A1"],
  ["der Stuhl", "the chair", "A1"],
  ["das Fenster", "the window", "A1"],
  ["die Tür", "the door", "A1"],
  ["das Frühstück", "the breakfast", "A1"],
  ["das Mittagessen", "the lunch", "A1"],
  ["das Abendessen", "the dinner", "A1"],
  ["das Wasser", "the water", "A1"],
  ["der Kaffee", "the coffee", "A1"],
  ["das Brot", "the bread", "A1"],
  ["die Milch", "the milk", "A1"],
  ["das Geld", "the money", "A1"],
  ["der Preis", "the price", "A1"],
  ["die Kasse", "the checkout", "A1"],
  ["der Supermarkt", "the supermarket", "A1"],
  ["die Woche", "the week", "A1"],
  ["der Tag", "the day", "A1"],
  ["der Morgen", "the morning", "A1"],
  ["der Abend", "the evening", "A1"],
  ["die Nacht", "the night", "A1"],
  ["das Jahr", "the year", "A1"],
  ["die Zeit", "the time", "A1"],
  ["die Uhr", "the clock / o'clock", "A1"],
  ["heute", "today", "A1"],
  ["morgen", "tomorrow", "A1"],
  ["gestern", "yesterday", "A1"],
  ["immer", "always", "A1"],
  ["oft", "often", "A1"],
  ["manchmal", "sometimes", "A1"],
  ["nie", "never", "A1"],
  ["das Wetter", "the weather", "A2"],
  ["die Sonne", "the sun", "A2"],
  ["der Regen", "the rain", "A2"],
  ["der Schnee", "the snow", "A2"],
  ["der Wind", "the wind", "A2"],
  ["das Hobby", "the hobby", "A2"],
  ["die Freizeit", "the free time", "A2"],
  ["der Urlaub", "the vacation / holiday", "A2"],
  ["die Reise", "the trip / journey", "A2"],
  ["der Flug", "the flight", "A2"],
  ["der Koffer", "the suitcase", "A2"],
  ["die Gesundheit", "the health", "A2"],
  ["der Arzt", "the (male) doctor", "A2"],
  ["die Ärztin", "the (female) doctor", "A2"],
  ["das Medikament", "the medicine", "A2"],
  ["die Schmerzen", "the pain(s)", "A2"],
  ["die Erkältung", "the cold (illness)", "A2"],
  ["die Verabredung", "the appointment / date", "A2"],
  ["das Ereignis", "the event", "A2"],
  ["die Erfahrung", "the experience", "A2"],
  ["die Rechnung", "the bill / invoice", "A2"],
  ["die Quittung", "the receipt", "A2"],
  ["die Reklamation", "the complaint", "A2"],
  ["die Umwelt", "the environment", "B1"],
  ["der Müll", "the trash / garbage", "B1"],
  ["die Verschmutzung", "the pollution", "B1"],
  ["die Wohngemeinschaft", "the shared flat (WG)", "B1"],
  ["der Vermieter", "the (male) landlord", "B1"],
  ["der Nachmieter", "the next tenant", "B1"],
  ["die Versicherung", "the insurance", "B1"],
  ["der Vertrag", "the contract", "B1"],
  ["die Bewerbung", "the application", "B1"],
  ["der Lebenslauf", "the CV / résumé", "B1"],
  ["das Vorstellungsgespräch", "the job interview", "B1"],
  ["die Karriere", "the career", "B1"],
  ["die Gesellschaft", "the society", "B2"],
  ["die Medien", "the media", "B2"],
  ["die Meinungsfreiheit", "the freedom of speech", "B2"],
  ["die Klimawandel", "the climate change", "B2"],
  ["der Verbrauch", "the consumption", "B2"],
  ["die Verantwortung", "the responsibility", "B2"],
  ["die Lösung", "the solution", "B2"],
  ["der Vorteil", "the advantage", "B2"],
  ["der Nachteil", "the disadvantage", "B2"],
  ["die Höflichkeit", "the politeness", "B2"],
  ["das Missverständnis", "the misunderstanding", "B2"],
  ["die Gewohnheit", "the habit", "B2"],
];

function wordlist(): VocabItem[] {
  return WORTLISTE.map(([word, definition, level]) => ({
    word,
    definition,
    level,
    source: "wortliste",
  }));
}

export function getAllVocab(): VocabItem[] {
  const seen = new Set<string>();
  const all = [...vocabFromUnits(), ...wordlist()];
  return all.filter((v) => {
    const k = v.word.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function vocabByLevel(level: string): VocabItem[] {
  return getAllVocab().filter((v) => v.level === level);
}
