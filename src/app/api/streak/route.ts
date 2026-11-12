import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { touchStreak } from "@/lib/streak";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let xpGain = 10;
  try {
    const body = await req.json();
    if (typeof body?.xpGain === "number") xpGain = Math.max(0, Math.min(100, body.xpGain));
  } catch {
    // default xp
  }

  const result = await touchStreak(user.id, xpGain);
  return NextResponse.json(result);
}
