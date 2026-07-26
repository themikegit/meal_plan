"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "meso-first:lang";

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    (async () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "sr") setLang(stored);
    })();
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "sr" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
