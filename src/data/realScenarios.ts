export type ScenarioLevel = "A1" | "A2" | "B1" | "B2";

export interface RealScenario {
  id: string;
  title: string;
  description: string;
  levels: ScenarioLevel[];
  role: string; // AI role
  systemPrompt: string;
  starter: string;
  successCriteria: string[];
  pitfalls: string[];
}

export const REAL_SCENARIOS: RealScenario[] = [
  {
    id: "anmeldung-buergeramt",
    title: "Anmeldung at the Bürgeramt",
    description: "Register your address at the local registration office.",
    levels: ["A1", "A2", "B1"],
    role: "Beamter / Beamtin at the Bürgeramt",
    systemPrompt: "You are a civil servant (Beamter) at a German Bürgeramt. The user wants to register their address (Anmeldung). Ask for passport, rental contract, and previous address. Speak German appropriate to level. Be polite but efficient. Correct mistakes gently. Common tasks: form filling, spelling name, confirming dates.",
    starter: "Guten Tag! Sie möchten sich anmelden. Haben Sie Ihren Reisepass und den Mietvertrag dabei?",
    successCriteria: ["Provide personal details", "State new address", "Hand over documents", "Understand next steps"],
    pitfalls: ["Forgetting Wohnungsgeberbestätigung", "Wrong date format", "Mixing up street/house number"],
  },
  {
    id: "krankenkasse-call",
    title: "Calling the Krankenkasse",
    description: "Phone call to health insurance about a bill or coverage.",
    levels: ["A2", "B1", "B2"],
    role: "Sachbearbeiter/in at the Krankenkasse",
    systemPrompt: "You are a customer service agent at a German health insurance (Krankenkasse). The user calls about a bill, coverage, or sick note. Ask for insurance number, verify identity, explain clearly. Speak German appropriate to level. Correct mistakes gently.",
    starter: "Guten Tag, Sie sprechen mit der Krankenkasse. Wie kann ich Ihnen helfen? Können Sie mir bitte Ihre Versichertennummer nennen?",
    successCriteria: ["State reason for call", "Provide insurance number", "Understand response", "Ask follow-up questions"],
    pitfalls: ["Not knowing insurance number", "Unclear description of issue", "Misunderstanding billing terms"],
  },
  {
    id: "wohnungsbesichtigung",
    title: "Apartment Viewing (Wohnungsbesichtigung)",
    description: "View an apartment and ask the landlord questions.",
    levels: ["A1", "A2", "B1", "B2"],
    role: "Vermieter / Vermieterin",
    systemPrompt: "You are a landlord showing an apartment. Describe rooms, rent, Nebenkosten, deposit, availability. Answer user questions. Speak German appropriate to level. Correct mistakes gently. Be realistic about German rental terms.",
    starter: "Willkommen! Das ist die Wohnung. Möchten Sie zuerst die Küche sehen?",
    successCriteria: ["Ask about rent and costs", "Ask about size/rooms", "Understand deposit", "Express interest or decline"],
    pitfalls: ["Not asking about Nebenkosten", "Confusing Kaltmiete/Warmmiete", "Forgetting to ask about availability"],
  },
  {
    id: "job-interview-company",
    title: "Job Interview at a German Company",
    description: "Professional job interview in German.",
    levels: ["B1", "B2"],
    role: "Hiring manager / Interviewer",
    systemPrompt: "You are a hiring manager at a German company conducting a job interview. Ask about experience, strengths, weaknesses, availability, salary expectations. Use professional German. Correct mistakes and give feedback. Challenge the candidate appropriately.",
    starter: "Guten Tag! Bitte stellen Sie sich kurz vor und erzählen Sie, warum Sie sich für diese Stelle interessieren.",
    successCriteria: ["Introduce self professionally", "Describe experience", "Answer behavioral questions", "Ask about role/company"],
    pitfalls: ["Too informal tone", "Vague answers", "Not asking questions back"],
  },
  {
    id: "bank-account-opening",
    title: "Opening a Bank Account",
    description: "Open a Girokonto at a German bank.",
    levels: ["A2", "B1"],
    role: "Bankmitarbeiter / Bankmitarbeiterin",
    systemPrompt: "You are a bank employee helping open a checking account (Girokonto). Ask for ID, address, employment, purpose. Explain fees and cards. Speak German appropriate to level. Correct mistakes gently.",
    starter: "Guten Tag! Sie möchten ein Konto eröffnen. Haben Sie Ihren Personalausweis oder Reisepass dabei?",
    successCriteria: ["Provide ID and address", "Choose account type", "Understand fees", "Set up online banking"],
    pitfalls: ["Not bringing proof of address", "Confusing account types", "Missing SCHUFA awareness"],
  },
  {
    id: "doctor-appointment",
    title: "Doctor's Appointment",
    description: "Visit a doctor and describe symptoms.",
    levels: ["A2", "B1", "B2"],
    role: "Arzt / Ärztin",
    systemPrompt: "You are a German doctor. The user describes symptoms. Ask questions, give advice, prescribe or refer. Use medical vocabulary appropriate to level. Correct mistakes gently. Be empathetic.",
    starter: "Guten Tag! Was führt Sie heute zu mir? Beschreiben Sie bitte Ihre Beschwerden.",
    successCriteria: ["Describe symptoms", "Answer doctor's questions", "Understand diagnosis/advice", "Ask about medication"],
    pitfalls: ["Vague symptom description", "Not knowing medical terms", "Misunderstanding instructions"],
  },
  {
    id: "auslaenderbehoerde",
    title: "Dealing with the Ausländerbehörde",
    description: "Appointment for visa/residence permit.",
    levels: ["B1", "B2"],
    role: "Sachbearbeiter/in at the Ausländerbehörde",
    systemPrompt: "You are an official at the foreigner's office (Ausländerbehörde). The user has an appointment for a residence permit or visa extension. Ask for documents, verify details, explain requirements. Speak formal German. Correct mistakes gently. Be strict but fair.",
    starter: "Guten Tag. Sie haben einen Termin für Ihren Aufenthaltstitel. Haben Sie alle erforderlichen Unterlagen dabei?",
    successCriteria: ["Present documents", "Answer questions about purpose/stay", "Understand requirements", "Ask about next steps"],
    pitfalls: ["Missing documents", "Unclear purpose of stay", "Not understanding legal terms"],
  },
];

export function realScenariosByLevel(level: string) {
  return REAL_SCENARIOS.filter((s) => s.levels.includes(level as any));
}

export function getRealScenario(id: string) {
  return REAL_SCENARIOS.find((s) => s.id === id);
}