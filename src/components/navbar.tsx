"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextSizeControl } from "@/components/text-size-control";
import { useI18n, UI_LANGS } from "@/lib/i18n";
import { Search } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [level, setLevel] = useState<string | null>(null);
  const supabase = createClient();
  const { t, lang, setLang } = useI18n();

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
          <Link href="/units" className="hover:text-primary">{t("units")}</Link>
          <Link href="/roadmap" className="hover:text-primary">Roadmap</Link>
          <Link href="/stories" className="hover:text-primary">Stories</Link>
          <Link href="/grammar" className="hover:text-primary">Grammar</Link>
          <Link href="/street" className="hover:text-primary">Street</Link>
          <Link href="/exam" className="hover:text-primary">{t("exam")}</Link>
          <Link href="/review" className="hover:text-primary">{t("review")}</Link>
          <Link href="/interview" className="hover:text-primary">Voice Practice</Link>
          <Link href="/leaderboard" className="hover:text-primary">{t("leaderboard")}</Link>
          <Link href="/dashboard" className="hover:text-primary">{t("dashboard")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Open command palette (Ctrl+K)"
            title="Search (Ctrl+K)"
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "k", bubbles: true }))}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2 text-xs text-muted-foreground hover:bg-accent"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <kbd className="hidden sm:inline">Ctrl K</kbd>
          </button>
          <select
            aria-label="UI language"
            className="hidden h-8 rounded-md border border-input bg-background px-1 text-xs sm:block"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            {UI_LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <TextSizeControl />
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>{t("signout")}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")}>Log in</Button>
              <Button size="sm" onClick={() => (window.location.href = "/signup")}>{t("signup")}</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}