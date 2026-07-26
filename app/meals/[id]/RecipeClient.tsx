"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { fetchPlan, fetchRecipe, setPlanSlot } from "@/lib/client";
import type { Recipe } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import { firstEmptySlot } from "@/lib/plan";
import { useLang } from "@/components/LangProvider";
import LangToggle from "@/components/LangToggle";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { MEAT_LABELS, t, tr } from "@/lib/i18n";

export default function RecipeClient({ id }: { id: string }) {
  const router = useRouter();
  const { lang } = useLang();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [added, setAdded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchRecipe(id);
      if (!cancelled) setRecipe(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!recipe) {
    return <div className="px-[var(--space-4)] pt-[var(--space-4)] text-sm text-neutral-600">…</div>;
  }

  const style = meatStyle(recipe.meat);
  const name = lang === "en" ? recipe.name_en : recipe.name_sr;

  const addToWeek = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const plan = await fetchPlan();
      const day = firstEmptySlot(plan, "dinner");
      if (day) {
        await setPlanSlot(day, "dinner", recipe.id);
        setAdded(true);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-4)] px-[var(--space-4)] pt-[var(--space-3)] pb-28">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <ArrowLeft size={20} strokeWidth={2.75} />
        </button>
        <LangToggle />
      </div>

      <PhotoPlaceholder
        className="h-[180px] rounded-[var(--radius-lg)]"
        tint={style.bg}
      />

      <div>
        <span
          className="inline-flex rounded-[calc(var(--radius-md)*0.75)] px-2.5 py-0.5 text-[10px] font-bold tracking-[.1em] uppercase"
          style={{ background: style.bg, color: style.text }}
        >
          {recipe.meat ? tr(MEAT_LABELS[recipe.meat], lang) : ""}
        </span>
        <h1 className="mt-2 text-[33px] leading-[1.05] text-text">{name}</h1>
      </div>

      <div className="grid grid-cols-3 gap-[var(--space-2)]">
        <MacroTile
          value={`${recipe.protein}g`}
          label={tr(t.protein, lang).toUpperCase()}
          valueColor={style.bg}
        />
        <MacroTile value={`${recipe.calories}`} label={tr(t.kcal, lang).toUpperCase()} />
        <MacroTile value={`${recipe.time_min}${tr(t.minutes, lang)}`} label="TIME" />
      </div>

      <section>
        <h2 className="mb-2 text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {tr(t.ingredients, lang)} · {tr(t.servings, lang)}
        </h2>
        <div className="rounded-[var(--radius-lg)] bg-surface p-[var(--space-3)]">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className={`flex gap-[var(--space-3)] py-2.5 ${
                i > 0 ? "border-t border-[var(--color-divider)]" : ""
              }`}
            >
              <span className="min-w-[70px] flex-none text-[12.5px] font-bold text-accent-700">
                {ing.qty}
              </span>
              <span className="text-[15px] text-text">
                {lang === "en" ? ing.name_en : ing.name_sr}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {tr(t.method, lang)}
        </h2>
        <div className="flex flex-col gap-[var(--space-3)]">
          {recipe.steps.map((s, i) => (
            <div key={i} className="flex gap-[var(--space-3)]">
              <span
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[13px] font-bold text-white"
                style={{ background: style.bg, color: style.text }}
              >
                {i + 1}
              </span>
              <p className="text-[15px] leading-[1.5] text-neutral-800">
                {lang === "en" ? s.en : s.sr}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md gap-[var(--space-2)] border-t border-[var(--color-divider)] bg-surface p-[var(--space-4)] safe-pb">
        <button
          type="button"
          onClick={addToWeek}
          disabled={saving}
          className="flex-1 rounded-full px-[var(--space-4)] py-[18px] text-base font-bold text-white disabled:opacity-60"
          style={
            added
              ? { background: "var(--color-accent-2-200)", color: "var(--color-accent-2-800)" }
              : { background: style.bg, color: style.text }
          }
        >
          {added ? tr(t.addedToWeek, lang) : tr(t.addToWeek, lang)}
        </button>
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label="Favorite"
          className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full bg-bg"
        >
          <Heart
            size={22}
            strokeWidth={2.75}
            fill={liked ? "var(--color-accent)" : "none"}
            color={liked ? "var(--color-accent)" : "var(--color-neutral-600)"}
          />
        </button>
      </div>
    </div>
  );
}

function MacroTile({
  value,
  label,
  valueColor,
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-surface px-[var(--space-2)] py-[var(--space-3)] text-center">
      <div
        className="font-heading text-[22px] leading-none"
        style={{ color: valueColor ?? "var(--color-text)" }}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[10px] font-bold tracking-[.09em] text-neutral-600">
        {label}
      </div>
    </div>
  );
}
