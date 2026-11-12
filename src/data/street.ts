// Real-world German mini-lessons: authentic snippets from daily life in Germany
// (signs, announcements, menus, messages) with one comprehension question each.

export interface StreetItem {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  icon: string;
  context: string;          // where you'd see this
  authentic: string;        // the real-world German text
  question: string;
  options: string[];
  answerIndex: number;
  vocab: { word: string; definition: string }[];
  culture: string;          // why this matters in Germany
}

export const STREET_ITEMS: StreetItem[] = [
  {
    id: "db-announcement",
    level: "A1",
    icon: "🚆",
    context: "Speaker announcement at a German train station",
    authentic: "„Meine Damen und Herren, der ICE 577 nach München fährt heute von Gleis 7 ab. Bitte beachten Sie: Der Zug verspätet sich um etwa 10 Minuten.\"",
    question: "What should passengers do?",
    options: ["Go to platform 7", "Board at platform 3", "Cancel the trip"],
    answerIndex: 0,
    vocab: [{ word: "das Gleis", definition: "the platform/track" }, { word: "sich verspäten", definition: "to be delayed" }],
    culture: "Announcements use formal 'Meine Damen und Herren' — listening for numbers (Gleis, Minuten) is the most useful A1 skill.",
  },
  {
    id: "post-sticker",
    level: "A1",
    icon: "📦",
    context: "Sticker on a parcel at the post office",
    authentic: "„FRAGILE – ZERBRECHLICH! Nicht werfen. Oben ↑“",
    question: "What does 'Zerbrechlich' mean?",
    options: ["Fragile", "Heavy", "Urgent"],
    answerIndex: 0,
    vocab: [{ word: "zerbrechlich", definition: "fragile / breakable" }, { word: "werfen", definition: "to throw" }],
    culture: "Germany still uses lots of print stickers with short imperative forms — 'Nicht + verb' is everywhere.",
  },
  {
    id: "supermarket-offer",
    level: "A1",
    icon: "🛒",
    context: "Yellow discount tag in a German supermarket",
    authentic: "„Aktionsware: Gouda Scheiben 200g nur 1,29 € statt 2,19 € — gültig bis Samstag.\"",
    question: "Until when is the offer valid?",
    options: ["Saturday", "Monday", "All month"],
    answerIndex: 0,
    vocab: [{ word: "das Angebot", definition: "the offer" }, { word: "gültig", definition: "valid" }],
    culture: "Yellow tags = Aktionsware (special offers). 'statt' shows the old price — Germans love comparing prices.",
  },
  {
    id: "supermarket-treue",
    level: "A2",
    icon: "🛍️",
    context: "Checkout receipt footer",
    authentic: "„Umsatz 23,87 €. Gegeben: 25,00 €. Rückgeld: 1,13 €. Bitte bewahren Sie diesen Beleg auf. Pfandflaschen: 0,75 € gutgeschrieben.\"",
    question: "How much deposit (Pfand) was credited?",
    options: ["0,75 €", "23,87 €", "1,13 €"],
    answerIndex: 0,
    vocab: [{ word: "das Pfand", definition: "the (bottle) deposit" }, { word: "der Beleg", definition: "the receipt" }],
    culture: "Pfand is serious business: 8–25 cents per bottle. Machines (Pfandautomat) print vouchers you redeem at the till.",
  },
  {
    id: "apartment-note",
    level: "A2",
    icon: "🚪",
    context: "Note taped to a neighbour's door",
    authentic: "„Liebe Nachbarn, am Freitag 8–12 Uhr wird der Teppich verlegt. Es kann laut werden. Danke für Ihr Verständnis! Familie Yilmaz“",
    question: "When will it be noisy?",
    options: ["Friday morning", "Every evening", "Saturday all day"],
    answerIndex: 0,
    vocab: [{ word: "verlegen", definition: "to lay (carpet/pipe)" }, { word: "das Verständnis", definition: "the understanding" }],
    culture: "Germans leave formal notes for noise. Quiet hours (Ruhezeit) are law: typically 22:00–6:00 and Sundays.",
  },
  {
    id: "bistro-menu",
    level: "A2",
    icon: "🍽️",
    context: "Chalkboard menu outside a bistro",
    authentic: "„Tages specials: Schnitzerl mit Pommes 9,90 € · Tagessuppe mit Brot 5,50 € · Hausgemachter Apfelstrudel 4,20 €\"",
    question: "What costs 5,50 €?",
    options: ["Soup with bread", "Schnitzel with fries", "Apple strudel"],
    answerIndex: 0,
    vocab: [{ word: "die Tagessuppe", definition: "the soup of the day" }, { word: "hausgemacht", definition: "homemade" }],
    culture: "'Tages…' means 'of the day'. Many cafés take cash only (EC cards increasingly accepted) — look for 'Nur Bargeld'.",
  },
  {
    id: "bus-ticket",
    level: "A2",
    icon: "🎫",
    context: "Back of a public transport ticket",
    authentic: "„Einzelfahrschein Erwachsener, Preisstufe AB. Gültig 2 Stunden ab Entwertung. Umsteigen erlaubt, Rundfahrten nicht.\"",
    question: "How long is the ticket valid?",
    options: ["2 hours", "All day", "One ride only, no transfers"],
    answerIndex: 0,
    vocab: [{ word: "der Einzelfahrschein", definition: "the single ticket" }, { word: "die Entwertung", definition: "validation (stamping)" }],
    culture: "Stamps only exist in some cities (Entwerter). In most, tickets are bought in the app — controllers check randomly; fines start at 60 €.",
  },
  {
    id: "doctor-sign",
    level: "B1",
    icon: "🩺",
    context: "Sign in a doctor's waiting room",
    authentic: "„Bitte nehmen Sie Platz. Bei Akutfällen ohne Termin warten Sie bitte, bis Sie aufgerufen werden. Arztdienst außerhalb der Sprechzeiten: 116 117.\"",
    question: "What should you do outside consultation hours?",
    options: ["Call 116 117", "Come without appointment anytime", "Go to the hospital"],
    answerIndex: 0,
    vocab: [{ word: "die Sprechzeit", definition: "consultation hours" }, { word: "der Akutfall", definition: "acute/emergency case" }],
    culture: "116 117 is the non-emergency medical number (termin service). Real emergencies: 112. GPs usually require appointments (Termin).",
  },
  {
    id: "recycling-signs",
    level: "B1",
    icon: "♻️",
    context: "Signs at a recycling yard (Wertstoffhof)",
    authentic: "„Bioabfall, Papier, Verpackungen (gelbe Tonne) und Restabfall bitte getrennt entsorgen. Elektroschrott und Schadstoffe nur zu den Öffnungszeiten abgeben.\"",
    question: "When can you drop off electronics?",
    options: ["Only during opening hours", "Anytime", "Never"],
    answerIndex: 0,
    vocab: [{ word: "der Elektroschrott", definition: "electronic waste" }, { word: "entsorgen", definition: "to dispose of" }],
    culture: "Sorting waste is near-sacred: Gelbe Tonne = packaging, Biomüll = compost, Papier = blue bin. Wrong sorting can mean a fine from your landlord.",
  },
  {
    id: "bank-letter",
    level: "B1",
    icon: "🏦",
    context: "Letter from your bank",
    authentic: "„Sehr geehrte Kundin, sehr geehrter Kunde, wir möchten Sie daran erinnern, dass Ihr Kontoführungsgebühr zum 01.03. auf 4,90 € angepasst wird. Sie haben ein Sonderkündigungsrecht.\"",
    question: "What right does the customer have?",
    options: ["A special right to cancel", "A free account", "A bonus payment"],
    answerIndex: 0,
    vocab: [{ word: "die Kontoführungsgebühr", definition: "account maintenance fee" }, { word: "das Sonderkündigungsrecht", definition: "special termination right" }],
    culture: "Official letters (Behörde, Bank, Versicherung) use long compounds. 'Sonderkündigungsrecht' means you can cancel when terms change — a right worth knowing.",
  },
  {
    id: "work-email",
    level: "B1",
    icon: "💼",
    context: "Email from your German manager",
    authentic: "„Liebe Kolleginnen und Kollegen, das Team-Meeting verschieben wir auf Donnerstag 14 Uhr, Raum 204. Bitte bereitet jeweils einen kurzen Status vor. Viele Grüße, M. Weber\"",
    question: "What should everyone prepare?",
    options: ["A short status update", "A full presentation", "Lunch"],
    answerIndex: 0,
    vocab: [{ word: "verschieben", definition: "to postpone/move" }, { word: "den Status vorbereiten", definition: "to prepare a status" }],
    culture: "German work emails are brief, structured, and expect preparation. 'Viele Grüße' is the standard sign-off (not 'Best regards').",
  },
  {
    id: "landlord-email",
    level: "B2",
    icon: "🏠",
    context: "Email from your landlord",
    authentic: "„Sehr geehrte Frau Keller, hiermit informieren wir Sie über die turnusgemäße Modernisierung des Badezimmers (voraussichtlich KW 12–14). Das Mietverhältnis bleibt unberührt; eine Mietminderung ist ausgeschlossen, sofern die Wohnfläche unverändert bleibt.\"",
    question: "What does the letter say about rent reduction?",
    options: ["It is excluded under stated conditions", "It is guaranteed", "Rent will increase"],
    answerIndex: 0,
    vocab: [{ word: "die Mietminderung", definition: "rent reduction" }, { word: "das Mietverhältnis", definition: "the tenancy" }],
    culture: "B2-level bureaucratic language: 'hiermit', 'voraussichtlich', 'sofern'. Modernization notices have legal formats — knowing the structure helps you spot your rights.",
  },
  {
    id: "radio-ad",
    level: "B2",
    icon: "📻",
    context: "Radio advertisement",
    authentic: "„Sind Sie es leid, jeden Monat zu viel für Ihre Stromrechnung zu zahlen? Wechseln Sie jetzt — wir kündigen für Sie! Energie/plus: günstiger. Transparenter. Besser.\"",
    question: "What is the ad's promise?",
    options: ["They cancel your old contract for you", "Free electricity", "A free tariff check"],
    answerIndex: 0,
    vocab: [{ word: "die Stromrechnung", definition: "electricity bill" }, { word: "kündigen", definition: "to cancel (a contract)" }],
    culture: " Germans switch electricity/phone providers aggressively. Three-word slogans (günstiger. transparenter. besser.) are a classic ad structure — great for adjective practice.",
  },
];

/** Deterministic "item of the day" — changes daily, stable for all users. */
export function streetItemOfTheDay(): StreetItem {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return STREET_ITEMS[day % STREET_ITEMS.length];
}
