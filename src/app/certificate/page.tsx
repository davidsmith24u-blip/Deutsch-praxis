import { createClient } from "@/lib/supabase/server";
import { CertificateCard } from "@/components/certificate-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

function displayName(email: string | undefined): string {
  if (!email) return "German Learner";
  const prefix = email.split("@")[0].replace(/[._-]+/g, " ");
  return prefix
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CertificatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <h1 className="text-3xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">Log in to see your certificates.</p>
        <Link href="/login" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
          Log in
        </Link>
      </div>
    );
  }

  const { data: results } = await supabase
    .from("exam_results")
    .select("id, level, score, max_score, passed, created_at")
    .eq("user_id", user.id)
    .eq("kind", "mock")
    .eq("passed", true)
    .order("created_at", { ascending: false });

  const name = displayName(user.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your certificates 🏅</h1>
        <p className="text-muted-foreground">
          Passed a mock exam? Print your certificate or save it as a PDF — proof of your progress
          you can share or pin to the wall.
        </p>
      </div>

      {results && results.length > 0 ? (
        <div className="space-y-10">
          {results.map((r: any) => (
            <CertificateCard
              key={r.id}
              cert={{
                id: r.id.slice(0, 8).toUpperCase(),
                name,
                level: r.level,
                score: Number(r.score),
                maxScore: Number(r.max_score),
                date: new Date(r.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <p className="text-lg font-semibold">No certificate yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pass a mock exam to unlock your first certificate.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/mock/a1" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Take a mock exam
            </Link>
            <Link href="/roadmap" className="inline-flex h-10 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">
              View roadmap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
