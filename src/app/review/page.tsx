import Link from "next/link";
import ReviewClient from "@/components/review-client";

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review (Spaced Repetition)</h1>
        <p className="text-muted-foreground">
          Smart flashcards that resurface words right before you forget them.{" "}
          <Link href="/vocabulary" className="text-primary underline">Browse the vocabulary deck</Link>
        </p>
      </div>
      <ReviewClient />
    </div>
  );
}
