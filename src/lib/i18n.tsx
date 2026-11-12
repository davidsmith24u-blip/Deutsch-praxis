"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type UiLang = "en" | "de" | "tr" | "ar" | "es";

// Chrome strings: navigation + common headings. Extend the dictionary as pages adopt t().
const DICT: Record<string, Record<UiLang, string>> = {
  home: { en: "Home", de: "Start", tr: "Ana Sayfa", ar: "الرئيسية", es: "Inicio" },
  units: { en: "Units", de: "Lektionen", tr: "Üniteler", ar: "الوحدات", es: "Unidades" },
  speak: { en: "Speak", de: "Sprechen", tr: "Konuş", ar: "تحدث", es: "Hablar" },
  mistakes: { en: "Mistakes", de: "Fehler", tr: "Hatalar", ar: "الأخطاء", es: "Errores" },
  dashboard: { en: "Dashboard", de: "Übersicht", tr: "Panel", ar: "لوحة التحكم", es: "Panel" },
  exam: { en: "Exam", de: "Prüfung", tr: "Sınav", ar: "امتحان", es: "Examen" },
  review: { en: "Review", de: "Wiederholen", tr: "Tekrar", ar: "مراجعة", es: "Repasar" },
  vocabulary: { en: "Vocabulary", de: "Wortschatz", tr: "Kelime", ar: "المفردات", es: "Vocabulario" },
  leaderboard: { en: "Leaderboard", de: "Rangliste", tr: "Sıralama", ar: "المتصدرون", es: "Clasificación" },
  plan: { en: "Plan", de: "Plan", tr: "Plan", ar: "خطة", es: "Plan" },
  progress: { en: "Progress", de: "Fortschritt", tr: "İlerleme", ar: "التقدم", es: "Progreso" },
  signout: { en: "Sign out", de: "Abmelden", tr: "Çıkış", ar: "تسجيل الخروج", es: "Salir" },
  signup: { en: "Sign up", de: "Registrieren", tr: "Kayıt ol", ar: "إنشاء حساب", es: "Registrarse" },
};

interface I18nCtx {
  lang: UiLang;
  setLang: (l: UiLang) => void;
  t: (key: keyof typeof DICT | string) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => DICT[k]?.en ?? k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("ui-lang") as UiLang | null;
    if (saved && ["en", "de", "tr", "ar", "es"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: UiLang) => {
    setLangState(l);
    window.localStorage.setItem("ui-lang", l);
  }, []);

  const t = useCallback((key: string) => DICT[key]?.[lang] ?? DICT[key]?.en ?? key, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

export const UI_LANGS: Array<{ code: UiLang; label: string }> = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "tr", label: "TR" },
  { code: "ar", label: "AR" },
  { code: "es", label: "ES" },
];
