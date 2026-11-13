"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNITS, LEVELS } from "@/data/units";
import { REAL_SCENARIOS } from "@/data/realScenarios";
import { Search } from "lucide-react";

interface Item {
  label: string;
  hint: string;
  href: string;
  group: string;
}

const PAGES: Item[] = [
  { label: "Dashboard", hint: "Your progress, streak & quests", href: "/dashboard", group: "Pages" },
  { label: "Units", hint: "All 60 practice units", href: "/units", group: "Pages" },
  { label: "Roadmap", hint: "Visual level path A1–C2", href: "/roadmap", group: "Pages" },
  { label: "Stories", hint: "German reading stories", href: "/stories", group: "Pages" },
  { label: "Street German", hint: "How Germans really talk", href: "/street", group: "Pages" },
  { label: "Exam mode", hint: "Quick level exam", href: "/exam", group: "Pages" },
  { label: "Mock exam", hint: "Full 4-module exam", href: "/mock/a1", group: "Pages" },
  { label: "Certificate", hint: "Your printable certificates", href: "/certificate", group: "Pages" },
  { label: "Vocabulary", hint: "Word lists & Wortliste", href: "/vocabulary", group: "Pages" },
  { label: "Review (SRS)", hint: "Spaced repetition flashcards", href: "/review", group: "Pages" },
  { label: "Writing coach", hint: "Get feedback on your texts", href: "/writing", group: "Pages" },
  { label: "Voice practice", hint: "AI interview scenarios", href: "/interview", group: "Pages" },
  { label: "Leaderboard", hint: "Compare with learners", href: "/leaderboard", group: "Pages" },
  { label: "My plan", hint: "Generated study plan", href: "/plan", group: "Pages" },
  { label: "Quests", hint: "This week's missions", href: "/quests", group: "Pages" },
];

/** Very small fuzzy score: subsequence match with early position bonus. */
function score(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let s = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      s += 1 + (t.length - i < 100 ? (100 - (t.length - i)) / 100 : 0);
      qi++;
    }
  }
  return qi === q.length ? s : 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...PAGES,
      ...UNITS.map((u) => ({
        label: u.title,
        hint: `${u.level} · ${u.objective}`,
        href: `/units/${u.id}`,
        group: "Units",
      })),
      ...REAL_SCENARIOS.map((s) => ({
        label: s.title,
        hint: `Interview scenario · ${s.levels.join("/")}`,
        href: `/interview`,
        group: "Interviews",
      })),
    ];
    if (!query.trim()) return all.slice(0, 20);
    return all
      .map((it) => ({ it, s: Math.max(score(query, it.label), score(query, it.hint) * 0.5) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 20)
      .map((x) => x.it);
  }, [query]);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter" && items[active]) { e.preventDefault(); go(items[active].href); }
            }}
            placeholder="Jump to a page, unit, or scenario…"
            aria-label="Search the app"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
          {items.map((it, i) => (
            <li key={`${it.group}-${it.href}`} role="option" aria-selected={i === active}>
              <Link
                href={it.href}
                onMouseEnter={() => setActive(i)}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${i === active ? "bg-accent" : ""}`}
              >
                <span className="truncate font-medium">{it.label}</span>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{it.hint}</span>
              </Link>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</li>
          )}
        </ul>
        <div className="border-t px-4 py-2 text-[11px] text-muted-foreground">
          {LEVELS.length} levels · ↑↓ navigate · ↵ open
        </div>
      </div>
    </div>
  );
}
