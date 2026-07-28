"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchRecipes } from "@/lib/client";
import type { Meat, Recipe } from "@/lib/types";
import { MEATS } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import { useLang } from "@/components/LangProvider";
import LangToggle from "@/components/LangToggle";
import RecipeCard from "@/components/RecipeCard";
import { MEAT_LABELS, t, tr } from "@/lib/i18n";

type FilterValue = "all" | Meat;

export default function MealsClient() {
  const router = useRouter();
  const { lang } = useLang();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchRecipes();
        if (!cancelled) setRecipes(data.filter((r) => r.meat !== null));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = filter === "all" ? recipes : recipes.filter((r) => r.meat === filter);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-3)] px-[var(--space-4)] pt-[var(--space-3)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div>
          <h1 className="text-[34px] leading-none text-text">{tr(t.allMeals, lang)}</h1>
          <div className="mt-2 text-[12.5px] font-medium text-neutral-600">
            {recipes.length} {tr(t.countLine, lang)}
          </div>
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/meals/new")}
            aria-label="Add recipe"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg"
          >
            <Plus size={20} strokeWidth={2.75} />
          </button>
          <LangToggle />
        </div>
      </div>

      <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
        <FilterPill
          active={filter === "all"}
          label={tr(t.all, lang)}
          activeBg="var(--color-accent)"
          activeText="#fff"
          onClick={() => setFilter("all")}
        />
        {MEATS.map((meat) => {
          const style = meatStyle(meat);
          return (
            <FilterPill
              key={meat}
              active={filter === meat}
              label={tr(MEAT_LABELS[meat], lang)}
              activeBg={style.bg}
              activeText={style.text}
              onClick={() => setFilter(meat)}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-[var(--space-3)] pb-8">
        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-600">…</div>
        ) : (
          visible.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} lang={lang} />)
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  label,
  activeBg,
  activeText,
  onClick,
}: {
  active: boolean;
  label: string;
  activeBg: string;
  activeText: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-none rounded-full px-[18px] py-[10px] text-sm transition-colors"
      style={
        active
          ? { background: activeBg, color: activeText, fontWeight: 700 }
          : { background: "var(--color-surface)", color: "var(--color-neutral-700)" }
      }
    >
      {label}
    </button>
  );
}
