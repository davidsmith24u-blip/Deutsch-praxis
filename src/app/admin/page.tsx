export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminUnits from "@/components/admin-units";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin — Unit Editor</h1>
        <p className="text-muted-foreground">
          Your account ({user.email}) is not an admin yet. To become an admin, run this SQL once in the
          Supabase SQL editor (Dashboard → SQL editor):
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">update public.profiles
set role = &apos;admin&apos;
where email = &apos;{user.email}&apos;;</pre>
        <p className="text-sm text-muted-foreground">
          Also make sure migration <code>0002_custom_units.sql</code> has been run (it adds the
          <code> role</code> column and the <code>custom_units</code> table).
        </p>
        <p className="text-sm text-muted-foreground">Reload this page afterwards.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin — Unit Editor</h1>
        <p className="text-muted-foreground">Create, edit, and delete units. Changes appear on the Units page immediately.</p>
      </div>
      <AdminUnits />
    </div>
  );
}
