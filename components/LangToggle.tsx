"use client";

import { useLang } from "./LangProvider";

export default function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className="flex flex-none items-center rounded-full bg-surface p-[3px] mt-1"
    >
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
          lang === "en" ? "bg-accent text-bg" : "text-neutral-600"
        }`}
      >
        EN
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
          lang === "sr" ? "bg-accent text-bg" : "text-neutral-600"
        }`}
      >
        SR
      </span>
    </button>
  );
}
