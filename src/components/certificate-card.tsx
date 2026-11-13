"use client";

import { useRef, useState } from "react";

export interface CertificateData {
  id: string;
  name: string;
  level: string;
  score: number;
  maxScore: number;
  date: string;
}

export function CertificateCard({ cert }: { cert: CertificateData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [printing, setPrinting] = useState(false);

  const print = () => {
    const el = ref.current;
    if (!el) return;
    setPrinting(true);
    el.classList.add("print-me");
    const cleanup = () => {
      el.classList.remove("print-me");
      setPrinting(false);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => window.print(), 50);
    // Safety net for browsers that don't fire afterprint
    setTimeout(cleanup, 4000);
  };

  const pct = cert.maxScore ? Math.round((cert.score / cert.maxScore) * 100) : 0;

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        className="cert relative overflow-hidden rounded-2xl border-4 border-double border-indigo-600/60 bg-white p-8 text-slate-900 shadow-lg"
        aria-label={`Certificate for ${cert.name}, level ${cert.level}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-xl border border-indigo-600/30" />
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-indigo-700">
          DeutschPraxis
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight">Certificate of Achievement</h2>
        <p className="mt-6 text-center text-sm text-slate-600">This certifies that</p>
        <p className="mt-2 text-center text-3xl font-semibold">{cert.name}</p>
        <p className="mt-4 text-center text-sm text-slate-600">
          has successfully passed the <strong>{cert.level}</strong> mock examination
        </p>
        <p className="mt-1 text-center text-sm text-slate-600">
          with a result of <strong>{cert.score}/{cert.maxScore}</strong> ({pct}%)
        </p>
        <div className="mt-8 flex items-end justify-between text-xs text-slate-600">
          <div>
            <p className="font-medium text-slate-800">{cert.date}</p>
            <p>Date</p>
          </div>
          <div className="text-center" aria-hidden="true">
            <span className="text-3xl">🏅</span>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-800">DeutschPraxis</p>
            <p>Issuing platform</p>
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] text-slate-400">Certificate ID: {cert.id}</p>
      </div>

      <button
        onClick={print}
        disabled={printing}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {printing ? "Opening print…" : "Print / Save as PDF"}
      </button>
    </div>
  );
}
