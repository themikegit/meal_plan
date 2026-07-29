"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { fetchRecipes } from "@/lib/client";
import { MEAL_TYPES, MEATS, type Meat, type MealType, type Recipe } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import RecipeCard from "@/components/RecipeCard";
import { MEAL_TYPE_LABELS, MEAT_LABELS, STR } from "@/lib/strings";

type MeatFilter = "all" | Meat;

const MEAT_VISIBLE: MealType[] = ["lunch", "dinner"];

export default function MealsClient() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [meatFilter, setMeatFilter] = useState<MeatFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchRecipes();
        if (!cancelled) setRecipes(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showMeatFilter = MEAT_VISIBLE.includes(mealType);
  const byMealType = recipes.filter((r) => r.meal_type === mealType);
  const visible =
    showMeatFilter && meatFilter !== "all"
      ? byMealType.filter((r) => r.meat === meatFilter)
      : byMealType;

  const selectMealType = (m: MealType) => {
    setMealType(m);
    setMeatFilter("all");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-3)] px-[var(--space-4)] pt-[var(--space-3)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div>
          <h1 className="text-[34px] leading-none text-text">{MEAL_TYPE_LABELS[mealType]}</h1>
          <div className="mt-2 text-[12.5px] font-medium text-neutral-600">
            {byMealType.length} {STR.countLine}
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/meals/new")}
          aria-label="Add recipe"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent text-bg"
        >
          <Plus size={20} strokeWidth={2.75} />
        </button>
      </div>

      <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
        {MEAL_TYPES.map((m) => (
          <FilterPill
            key={m}
            active={mealType === m}
            label={MEAL_TYPE_LABELS[m]}
            activeBg="var(--color-accent)"
            activeText="#fff"
            onClick={() => selectMealType(m)}
          />
        ))}
      </div>

      {showMeatFilter ? (
        <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
          <FilterPill
            active={meatFilter === "all"}
            label={STR.all}
            activeBg="var(--color-accent)"
            activeText="#fff"
            onClick={() => setMeatFilter("all")}
          />
          {MEATS.map((meat) => {
            const style = meatStyle(meat);
            return (
              <FilterPill
                key={meat}
                active={meatFilter === meat}
                label={MEAT_LABELS[meat]}
                activeBg={style.bg}
                activeText={style.text}
                onClick={() => setMeatFilter(meat)}
              />
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-[var(--space-3)] pb-8">
        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-600">…</div>
        ) : (
          visible.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
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
