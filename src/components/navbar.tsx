"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextSizeControl } from "@/components/text-size-control";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [level, setLevel] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("profiles").select("current_level").eq("id", data.user.id).single().then(({ data: p }) => setLevel(p?.current_level ?? null));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("profiles").select("current_level").eq("id", session.user.id).single().then(({ data: p }) => setLevel(p?.current_level ?? null));
      } else {
        setLevel(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">🇩🇪</span> DeutschPraxis
        </Link>
        {level && <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-xs font-medium md:inline">{level}</span>}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/curriculum" className="hover:text-primary">Curriculum</Link>
          <Link href="/units" className="hover:text-primary">Units</Link>
          <Link href="/exam" className="hover:text-primary">Exam</Link>
          <Link href="/interview" className="hover:text-primary">Voice Practice</Link>
          <Link href="/mistakes" className="hover:text-primary">Mistakes</Link>
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <TextSizeControl />
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")}>Log in</Button>
              <Button size="sm" onClick={() => (window.location.href = "/signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}