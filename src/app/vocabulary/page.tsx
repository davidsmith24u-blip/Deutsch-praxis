import Link from "next/link";
import VocabularyClient from "@/components/vocabulary-client";
import { getAllVocab } from "@/data/vocab";

export const metadata = { title: "Vocabulary — DeutschPraxis" };

export default function VocabularyPage() {
  const items = getAllVocab().map((v) => ({ word: v.word, definition: v.definition, level: v.level }));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vocabulary</h1>
        <p className="text-muted-foreground">
          Every word from the units plus a Goethe-style Wortliste.{" "}
          <Link href="/review" className="text-primary underline">Learn them with spaced repetition →</Link>
        </p>
      </div>
      <VocabularyClient items={items} />
    </div>
  );
}
