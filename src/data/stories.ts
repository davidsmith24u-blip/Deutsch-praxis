export interface StoryQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Story {
  id: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  summary: string;
  paragraphs: string[];
  vocab: { word: string; definition: string }[];
  questions: StoryQuestion[];
}

export const STORIES: Story[] = [
  {
    id: "anna-ankunft",
    level: "A1",
    title: "Annas erster Tag in Berlin",
    summary: "Anna arrives in Berlin with one suitcase and a new address.",
    paragraphs: [
      "Anna kommt aus Istanbul. Heute ist ihr erster Tag in Berlin. Sie hat einen Koffer und eine kleine Tasche. Die Wohnung ist in der Köpenicker Straße.",
      "Der Bus ist voll. Anna fragt eine Frau: „Entschuldigung, wo ist die Köpenicker Straße?“ Die Frau sagt: „Zwei Stationen, dann links.“ Anna sagt: „Vielen Dank!“",
      "Vor der Wohnung steht ein Mann. Das ist Herr Klein, der Vermieter. Er sagt: „Guten Tag! Du bist die neue Mieterin. Hier ist der Schlüssel.“",
      "Die Wohnung ist klein, aber schön. Es gibt ein Bett, einen Tisch und ein Fenster. Anna ist müde, aber glücklich. Sie sagt: „Berlin, ich bin da!“",
    ],
    vocab: [
      { word: "der Koffer", definition: "the suitcase" },
      { word: "die Mieterin", definition: "the (female) tenant" },
      { word: "der Schlüssel", definition: "the key" },
      { word: "die Station", definition: "the (bus) stop" },
    ],
    questions: [
      {
        question: "Woher kommt Anna?",
        options: ["Aus Istanbul", "Aus Wien", "Aus Hamburg"],
        answer: "Aus Istanbul",
        explanation: "„Anna kommt aus Istanbul“ — the first sentence.",
      },
      {
        question: "Was hat Anna bei sich?",
        options: ["Einen Koffer und eine Tasche", "Zwei Koffer", "Nur eine Tasche"],
        answer: "Einen Koffer und eine Tasche",
        explanation: "„Sie hat einen Koffer und eine kleine Tasche.“",
      },
      {
        question: "Wer ist Herr Klein?",
        options: ["Der Busfahrer", "Der Vermieter", "Annas Nachbar"],
        answer: "Der Vermieter",
        explanation: "„Das ist Herr Klein, der Vermieter.“",
      },
      {
        question: "Wie fühlt sich Anna am Ende?",
        options: ["Wütend", "Müde, aber glücklich", "Krank"],
        answer: "Müde, aber glücklich",
        explanation: "„Anna ist müde, aber glücklich.“",
      },
    ],
  },
  {
    id: "donnerstagskuchen",
    level: "A2",
    title: "Der Donnerstagskuchen",
    summary: "Every Thursday, Oma Inge bakes — and the whole building knows it.",
    paragraphs: [
      "Jeden Donnerstag backt Oma Inge einen Kuchen. Um halb drei riecht das ganze Haus nach Apfel und Zimt. Die Nachbarn im zweiten Stock wissen dann: Der Donnerstag ist gerettet.",
      "Timon, acht Jahre alt, kommt immer zuerst. „Oma Inge, ist der Kuchen fertig?“ — „Fast. Aber erst die Hände waschen!“ Timon verschwindet ins Badezimmer und ist in dreißig Sekunden zurück.",
      "Heute ist etwas anders. Oma Inge hat ein neues Rezept aus dem Internet: Rhabarberkuchen mit Streuseln. Timon probiert ein Stück und macht ein seltsames Gesicht. „Hmm“, sagt er. „Wie schmeckt es?“ fragt Oma Inge.",
      "„Es schmeckt … anders. Aber gut!“ Timon nimmt sich noch ein Stück. Oma Inge lacht. „Nächste Woche“, sagt sie, „backen wir wieder Apfelkuchen. Versprochen.“",
    ],
    vocab: [
      { word: "backen", definition: "to bake" },
      { word: "riechen", definition: "to smell" },
      { word: "das Rezept", definition: "the recipe" },
      { word: "die Streusel", definition: "crumbles (cake topping)" },
    ],
    questions: [
      {
        question: "Wann backt Oma Inge?",
        options: ["Jeden Donnerstag", "Am Wochenende", "Nur an Feiertagen"],
        answer: "Jeden Donnerstag",
        explanation: "„Jeden Donnerstag backt Oma Inge einen Kuchen.“",
      },
      {
        question: "Was riecht das ganze Haus nach?",
        options: ["Nach Apfel und Zimt", "Nach Schokolade", "Nach Rhabarber"],
        answer: "Nach Apfel und Zimt",
        explanation: "„Um halb drei riecht das ganze Haus nach Apfel und Zimt.“",
      },
      {
        question: "Was ist heute anders?",
        options: [
          "Oma Inge backt nichts",
          "Es gibt ein neues Rezept: Rhabarberkuchen",
          "Timon ist krank",
        ],
        answer: "Es gibt ein neues Rezept: Rhabarberkuchen",
        explanation: "„Heute ist etwas anders … ein neues Rezept aus dem Internet.“",
      },
      {
        question: "Was verspricht Oma Inge?",
        options: [
          "Nie wieder zu backen",
          "Nächste Woche wieder Apfelkuchen",
          "Dem Timon das Rezept zu geben",
        ],
        answer: "Nächste Woche wieder Apfelkuchen",
        explanation: "„Nächste Woche backen wir wieder Apfelkuchen. Versprochen.“",
      },
    ],
  },
  {
    id: "nachtschicht",
    level: "B1",
    title: "Nachtschicht im Krankenhaus",
    summary: "A nurse's night shift shows what German workplaces really sound like.",
    paragraphs: [
      "Es ist kurz nach zehn, als Aylin ihre Nachtschicht auf Station 4 beginnt. Die Kollegin von der Tagschicht übergibt ihr die Patienten: „Zimmer 2 braucht um Mitternacht seine Tabletten, Zimmer 5 ruft oft — aber meistens ist alles okay.“",
      "Um 23:40 klingelt Zimmer 5. Herr Baumgartner kann nicht schlafen. „Die Bettkante drückt“, sagt er. Aylin stellt das Bett höher und fragt nach seinen Enkeln. Zehn Minuten später schläft er.",
      "Um halb zwei wird es ernst: Herr Demir in Zimmer 2 hat Schmerzen in der Brust. Aylin misst den Blutdruck, ruft den diensthabenden Arzt an und bleibt bei ihm. „Alles beruhigt sich“, sagt der Arzt später. „Sie haben richtig gehandelt.“",
      "Um sechs geht die Sonne auf. Aylin schreibt den letzten Bericht und übergibt an die Tagschicht. Draußen wartet der Bus nach Hause. Sie ist erschöpft — und trotzdem stolz.",
    ],
    vocab: [
      { word: "die Nachtschicht", definition: "the night shift" },
      { word: "übergeben", definition: "to hand over" },
      { word: "der Blutdruck", definition: "the blood pressure" },
      { word: "diensthabend", definition: "on duty" },
    ],
    questions: [
      {
        question: "Wann beginnt Aylins Schicht?",
        options: ["Kurz nach zehn", "Um Mitternacht", "Um halb zwei"],
        answer: "Kurz nach zehn",
        explanation: "„Es ist kurz nach zehn, als Aylin ihre Nachtschicht … beginnt.“",
      },
      {
        question: "Warum kann Herr Baumgartner nicht schlafen?",
        options: ["Die Bettkante drückt", "Er hat Brustschmerzen", "Es ist zu laut"],
        answer: "Die Bettkante drückt",
        explanation: "„Die Bettkante drückt“, sagt er.",
      },
      {
        question: "Was macht Aylin bei Herrn Demir zuerst?",
        options: [
          "Sie misst den Blutdruck und ruft den Arzt an",
          "Sie gibt ihm sofort Tabletten",
          "Sie weckt die Tagschicht",
        ],
        answer: "Sie misst den Blutdruck und ruft den Arzt an",
        explanation: "„Aylin misst den Blutdruck, ruft den diensthabenden Arzt an …“",
      },
      {
        question: "Wie fühlt sich Aylin am Ende der Schicht?",
        options: ["Erschöpft, aber stolz", "Wütend", "Krank"],
        answer: "Erschöpft, aber stolz",
        explanation: "„Sie ist erschöpft — und trotzdem stolz.“",
      },
    ],
  },
  {
    id: "fundbuero",
    level: "B2",
    title: "Das Fundbüro",
    summary: "A lost violin leads to an unexpected reunion — reported like a feature story.",
    paragraphs: [
      "Das Fundbüro im hinteren Trakt des Rathauses ist kein Ort, an dem man Geschichten erwartet. Und doch sitzt dort, an einem grauen Dienstag, eine Frau mit einem leeren Notenhalter und erzählt vom bedeutendsten Gegenstand ihres Lebens.",
      "Miriam Sonnenfeld, Cellistin, hatte ihre Geige im Nachtzug nach Leipzig liegen lassen. „Nicht die Geige an sich“, betont sie. „Das Etikett meines Lehrers innen im Deckel. Er hat es vor zwanzig Jahren hineingeklebt, als ich Schülerin war.“",
      "Der Beamte Herr Witzke tippt ohne Eile. „Gegenstände mit Dokumentencharakter“, sagt er, „melden sich häufiger zurück, als man denkt.“ Tatsächlich: Drei Tage später ruft das Fundbüro in Dresden an. Die Geige war im Zugabteil gefunden und zum dortigen Büro gebracht worden.",
      "Beim Abholen geschieht das Unerwartete: Im Etikett findet sich eine Bleistiftnotiz des alten Lehrers — „Für M., möge sie weit spielen“ — datiert auf den Tag, an dem Miriam zum ersten Mal ein Konzert gab. Sie spielt seitdem wieder jeden Tag. Nicht wegen der Notiz, sagt sie. Aber auch nicht ganz ohne.",
    ],
    vocab: [
      { word: "das Fundbüro", definition: "lost-and-found office" },
      { word: "der Notenhalter", definition: "music stand" },
      { word: "der Zugabteil", definition: "train compartment" },
      { word: "das Dokument", definition: "the document" },
    ],
    questions: [
      {
        question: "Was war für Miriam das Wichtigste an der Geige?",
        options: [
          "Ihr materieller Wert",
          "Das Etikett ihres Lehrers im Deckel",
          "Ihre Farbe",
        ],
        answer: "Das Etikett ihres Lehrers im Deckel",
        explanation: "„Nicht die Geige an sich … Das Etikett meines Lehrers innen im Deckel.“",
      },
      {
        question: "Wo wurde die Geige gefunden?",
        options: ["Im Rathaus", "Im Nachtzug nach Leipzig", "In einem Hotel"],
        answer: "Im Nachtzug nach Leipzig",
        explanation: "Sie hatte sie im Nachtzug liegen lassen; Dresden meldet sich, weil sie im Zugabteil gefunden wurde.",
      },
      {
        question: "Was entdeckt Miriam beim Abholen?",
        options: [
          "Eine Bleistiftnotiz ihres Lehrers",
          "Ein Zugticket",
          "Einen neuen Deckel",
        ],
        answer: "Eine Bleistiftnotiz ihres Lehrers",
        explanation: "„Im Etikett findet sich eine Bleistiftnotiz des alten Lehrers.“",
      },
      {
        question: "Welche Haltung hat Herr Witzke?",
        options: ["Genervt", "Routiniert, mit trockenem Humor", "Ablehnend"],
        answer: "Routiniert, mit trockenem Humor",
        explanation: "„tippt ohne Eile“ + sein Satz über zurückmeldende Gegenstände klingt trocken-erfahren.",
      },
    ],
  },
  {
    id: "letzte-strasse",
    level: "C1",
    title: "Die letzte Straße vor dem Fluss",
    summary: "A C1 novella excerpt: a village, a river, and a decision that divides it.",
    paragraphs: [
      "Während die Brücke über die Lahn seit Wochen gesperrt war, wurde die Schustersche Gasse zur letzten Straße vor dem Fluss — und damit zum Schauplatz eines Streits, der das Dorf länglicher machte, als es je gewesen war.",
      "Die einen, allen voran der Landwirt Haller, verlangten eine Behelfsbrücke: Der Weg zur Käserei führe sonst über zwölf Kilometer Umweg, was sich mit jedem Liter Milch rechnen müsse. Die anderen, angeführt vom Vereinsvorsitzenden Brunn, pochten auf das Landschaftsbild: Eine Provisorienbrücke verunstalte gerade das, wofür Fremde ins Tal kämen.",
      "Was an der Oberfläche nach Kosten und Ästhetik aussah, entpuppte sich bei näherem Zusehen als eine Frage der Erzählung: Wer durfte bestimmen, was das Dorf sei — ein Ort, der funktioniert, oder einer, der sich zeigt? Haller sprach von Arbeit, Brunn von Ankunft; beide meinten, ohne es zu sagen, Zugehörigkeit.",
      "Am Ende war es keins von beiden. Die Gemeinde beschloss beides: eine schmale Holzbrücke, die im Winter entfernt würde, gebaut von Leuten aus dem Tal. Haller erhielt seinen Weg, Brunn sein Bild — und die Gasse ihren Namen zurück. Manche nannten das Kompromiss, andere Klugheit; die Milch kam jedenfalls pünktlich an.",
    ],
    vocab: [
      { word: "die Behelfsbrücke", definition: "makeshift/temporary bridge" },
      { word: "verunstalten", definition: "to deface, spoil the look of" },
      { word: "die Zugehörigkeit", definition: "belonging" },
      { word: "der Umweg", definition: "the detour" },
    ],
    questions: [
      {
        question: "Was fordert der Landwirt Haller?",
        options: [
          "Eine Behelfsbrücke, weil der Umweg zu lang ist",
          "Eine dauerhafte Betonbrücke",
          "Mehr Touristen im Tal",
        ],
        answer: "Eine Behelfsbrücke, weil der Umweg zu lang ist",
        explanation: "„verlangten eine Behelfsbrücke: Der Weg zur Käserei führe sonst über zwölf Kilometer Umweg.“",
      },
      {
        question: "Worauf pocht Brunn?",
        options: ["Auf das Landschaftsbild", "Auf niedrigere Kosten", "Auf mehr Verkehr"],
        answer: "Auf das Landschaftsbild",
        explanation: "„pochten auf das Landschaftsbild: Eine Provisorienbrücke verunstalte …“",
      },
      {
        question: "Worum geht es laut dem Text eigentlich?",
        options: [
          "Nur um Geld",
          "Um die Frage, wer bestimmt, was das Dorf ist",
          "Um die Wetterlage",
        ],
        answer: "Um die Frage, wer bestimmt, was das Dorf ist",
        explanation: "„entpuppte sich … als eine Frage der Erzählung: Wer durfte bestimmen, was das Dorf sei.“",
      },
      {
        question: "Wie wird der Konflikt gelöst?",
        options: [
          "Haller gibt nach",
          "Eine schmale Holzbrücke, im Winter entfernt",
          "Die Brücke bleibt gesperrt",
        ],
        answer: "Eine schmale Holzbrücke, im Winter entfernt",
        explanation: "„beschloss beides: eine schmale Holzbrücke, die im Winter entfernt würde.“",
      },
    ],
  },
  {
    id: "stille",
    level: "C2",
    title: "Stille",
    summary: "A C2 literary vignette on noise, memory, and the weight of quiet.",
    paragraphs: [
      "Man glaubt, Stille sei die Abwesenheit von Geräusch. In Wahrheit ist sie ein Gewebe aus dem, was bleibt, wenn alles Hörbare sich entfernt: der Nachhall eines Lebens, das eben noch sprach.",
      "Das Haus meiner Großmutter verstummte nicht an einem Tag. Es verstummte in Stufen, wie eine Treppe, die man rückwärts zählt — erst verschwand das Klappern des Küchenwassers, dann das Räuspern vor dem Radio, zuletzt das kindliche Lachen der Zimmerpflanzen, mit denen sie sprach, wenn niemand mehr zuhörte.",
      "Ich lernte damals, dass Trauern eine Sprachform ist. Wer schweigt, formuliert nicht — er atmet Sätze aus, die niemand mehr grammatisch prüft. Die Stille meines Großmutterhauses war kein Loch in der Welt, sondern ihre dichteste Stelle: dort, wo Bedeutung sich verdichtet, weil sie nicht mehr fließen will.",
      "Heute weiß ich: Manche Räume haben eine Musik, die erst ertönt, wenn alle Instrumente verstummt sind. Man nennt sie Stille und verwechselt sie mit Nichts — wie man eine Partitur mit weißem Papier verwechselt, auf dem immer noch, unsichtbar fast, alles steht.",
    ],
    vocab: [
      { word: "das Gewebe", definition: "the fabric / web" },
      { word: "verstummen", definition: "to fall silent" },
      { word: "die Partitur", definition: "the (musical) score" },
      { word: "die Trauer", definition: "grief / mourning" },
    ],
    questions: [
      {
        question: "Wie definiert der Text Stille?",
        options: [
          "Die Abwesenheit von Geräusch",
          "Ein Gewebe aus dem, was bleibt, wenn Hörbares sich entfernt",
          "Einen leeren Raum",
        ],
        answer: "Ein Gewebe aus dem, was bleibt, wenn Hörbares sich entfernt",
        explanation: "„In Wahrheit ist sie ein Gewebe aus dem, was bleibt …“",
      },
      {
        question: "Womit vergleicht der Text das Verstummen des Hauses?",
        options: [
          "Mit einer Treppe, die man rückwärts zählt",
          "Mit einem Gewitter",
          "Mit einer Uhr",
        ],
        answer: "Mit einer Treppe, die man rückwärts zählt",
        explanation: "„Es verstummte in Stufen, wie eine Treppe, die man rückwärts zählt.“",
      },
      {
        question: "Was heißt „Trauern ist eine Sprachform“?",
        options: [
          "Trauer ersetzt Grammatik",
          "Schweigen drückt aus, was Worte nicht prüfen können",
          "Trauer ist stumm",
        ],
        answer: "Schweigen drückt aus, was Worte nicht prüfen können",
        explanation: "„Wer schweigt, formuliert nicht — er atmet Sätze aus, die niemand mehr grammatisch prüft.“",
      },
      {
        question: "Welches Bild schließt den Text?",
        options: [
          "Eine Partitur auf weißem Papier",
          "Ein leeres Zimmer",
          "Ein Fluss",
        ],
        answer: "Eine Partitur auf weißem Papier",
        explanation: "„wie man eine Partitur mit weißem Papier verwechselt …“",
      },
    ],
  },
  {
    id: "der-beichteiner",
    level: "B1",
    title: "Der Beichteimer",
    summary: "A barber confesses everything to his sink. B1 narrative with dialogue.",
    paragraphs: [
      "Friseur Deniz führt seit elf Jahren denselben Laden, und seit elf Jahren spricht er mit seinem Waschbecken. Nicht aus Einsamkeit — aus Gründen des Berufsethos: Was der Kunde erzählt, geht den Kunden nichts an, aber jemanden muss es hören.",
      "Montags beichtet er den Lebenslauf des Studenten aus dem zweiten Stock: Fachwechsel, Liebeskummer, wieder Fachwechsel. Mittwochs hört das Becken von Herrn Ozan, der jedes Mal behauptet, sein Betrieb stehe kurz vor dem Verkauf an Apple. Freitags erzählt Frau Kelek von ihrer Schwiegermutter, und das Becken schweigt höflich.",
      "Eines Tages kommt ein neuer Kunde: ein Journalist, der einen Artikel über Friseure schreibt. „Erzählen Sie“, sagt er, „was Sie hier alles hören.“ Deniz scherzt nicht, lächelt aber. „Ich höre nichts“, sagt er. „Ich erzähle nur — meinem Becken.“",
      "Der Artikel erscheint trotzdem. Titel: „Der Mann, der zuhört, indem er spricht.“ Am Ende der Woche hat Deniz doppelt so viele Kunden wie sonst. Sie reden weniger über Haare und mehr über alles andere. Das Becken übrigens: wurde durch ein neues ersetzt. Deniz hat es aufbewahrt — im Keller, natürlich.",
    ],
    vocab: [
      { word: "der Friseur / die Friseurin", definition: "hairdresser" },
      { word: "das Berufsgeheimnis", definition: "professional secrecy" },
      { word: "beichten", definition: "to confess" },
      { word: "der Fachwechsel", definition: "changing one's field of study" },
    ],
    questions: [
      {
        question: "Mit wem spricht Friseur Deniz?",
        options: ["Mit seinem Waschbecken", "Mit sich selbst im Spiegel", "Mit seinem Hund"],
        answer: "Mit seinem Waschbecken",
        explanation: "„seit elf Jahren spricht er mit seinem Waschbecken.“",
      },
      {
        question: "Warum erzählt er dort alles?",
        options: [
          "Aus Einsamkeit",
          "Weil Kundengeschichten vertraulich sind",
          "Weil er introvertiert ist",
        ],
        answer: "Weil Kundengeschichten vertraulich sind",
        explanation: "„Was der Kunde erzählt, geht den Kunden nichts an …“",
      },
      {
        question: "Was behauptet Herr Ozan jedes Mal?",
        options: [
          "Sein Betrieb werde von Apple gekauft",
          "Er ziehe um",
          "Er habe das Lottogewinn verloren",
        ],
        answer: "Sein Betrieb werde von Apple gekauft",
        explanation: "„… behauptet, sein Betrieb stehe kurz vor dem Verkauf an Apple.“",
      },
      {
        question: "Was passiert nach dem Artikel?",
        options: [
          "Deniz schließt den Laden",
          "Mehr Kunden kommen und reden über alles",
          "Das Becken wird geklaut",
        ],
        answer: "Mehr Kunden kommen und reden über alles",
        explanation: "„Am Ende der Woche hat Deniz doppelt so viele Kunden … mehr über alles andere.“",
      },
    ],
  },
  {
    id: "sommer-1989",
    level: "A2",
    title: "Sommer 1989",
    summary: "Two friends, one wall, and the summer everything changed. A2 past-tense reading.",
    paragraphs: [
      "Im Sommer 1989 war Jonas zwölf Jahre alt. Er wohnte in Leipzig, und sein bester Freund Leo wohnte 250 Meter weiter — aber dazwischen lag nicht nur eine Straße, sondern eine ganze Grenze.",
      "Jonas und Leo sahen sich nur zweimal im Jahr: am Bahnhof Friedrichstraße, mit Pässen und Gepäckkontrolle. Sie sprachen dann über Fußball und Comic­hefte, als wäre alles normal. Es war nicht normal, aber es war ihr Leben.",
      "Im November 1989 öffneten sich die Grenzen. Jonas' Mutter weinte, der Vater saß still vor dem Fernseher. Am nächsten Morgen lief Jonas die 250 Meter — ohne Pass, ohne Kontrolle. Leo öffnete die Tür und sagte nur: „Du bist spät dran.“",
      "Die beiden Freunde lachten und spielten den ganzen Tag Fußball. Es war derselbe Ball wie immer — aber der Hof war plötzlich die halbe Welt.",
    ],
    vocab: [
      { word: "die Grenze", definition: "the border" },
      { word: "die Gepäckkontrolle", definition: "the luggage check" },
      { word: "öffnen", definition: "to open" },
      { word: "der Hof", definition: "the courtyard" },
    ],
    questions: [
      {
        question: "Wo wohnte Jonas im Sommer 1989?",
        options: ["In Leipzig", "In Berlin", "In Dresden"],
        answer: "In Leipzig",
        explanation: "„Er wohnte in Leipzig …“",
      },
      {
        question: "Wie oft sahen sich die Freunde normalerweise?",
        options: ["Zweimal im Jahr", "Jede Woche", "Nie"],
        answer: "Zweimal im Jahr",
        explanation: "„Jonas und Leo sahen sich nur zweimal im Jahr …“",
      },
      {
        question: "Was passierte im November 1989?",
        options: [
          "Die Grenzen öffneten sich",
          "Leo zog nach Leipzig",
          "Jonas' Familie feierte Weihnachten",
        ],
        answer: "Die Grenzen öffneten sich",
        explanation: "„Im November 1989 öffneten sich die Grenzen.“",
      },
      {
        question: "Was machte Leo, als Jonas ankam?",
        options: ["Er weinte", "Er sagte: „Du bist spät dran.“", "Er war nicht zu Hause"],
        answer: "Er sagte: „Du bist spät dran.“",
        explanation: "„Leo öffnete die Tür und sagte nur: ‚Du bist spät dran.‘“",
      },
    ],
  },
];

export function storiesByLevel(level: string) {
  return STORIES.filter((s) => s.level === level);
}

export function getStory(id: string) {
  return STORIES.find((s) => s.id === id);
}
