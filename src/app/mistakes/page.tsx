export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MistakesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: patterns } = await supabase
    .from("mistake_patterns")
    .select("*")
    .eq("user_id", user.id)
    .order("count", { ascending: false });

  const { data: mem } = await supabase.from("user_memory").select("*").eq("user_id", user.id).single();

  const total = (patterns ?? []).reduce((a: number, p: any) => a + (p.count ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mistakes Dashboard</h1>
        <p className="text-muted-foreground">Your most frequent error categories. The AI will target these in future interviews.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total mistakes</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{patterns?.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recurring</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{(mem?.common_errors ?? []).join(", ") || "None yet"}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequent error categories</CardTitle>
          <CardDescription>Sorted by frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(patterns ?? []).map((p: any) => (
              <div key={p.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.grammar_point}</p>
                  <Badge>{p.count}x</Badge>
                </div>
                {p.example && <p className="mt-1 text-sm text-muted-foreground">Example: {p.example}</p>}
                {p.correction && <p className="text-sm text-green-600">Correction: {p.correction}</p>}
              </div>
            ))}
            {(!patterns || patterns.length === 0) && <p className="text-muted-foreground">No mistakes tracked yet. Start an interview!</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}