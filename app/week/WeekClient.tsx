"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPlan, fetchRecipes, setPlanSlot } from "@/lib/client";
import { DAY_KEYS, SLOT_KINDS, type DayKey, type Plan, type Recipe, type SlotKind } from "@/lib/types";
import { weekSummary } from "@/lib/plan";
import { currentWeekDates, formatWeekRange } from "@/lib/week";
import { meatStyle } from "@/lib/meatColor";
import RecipePickerSheet from "@/components/RecipePickerSheet";
import { DAY_NAMES, SLOT_LETTERS, STR } from "@/lib/strings";

const EMPTY_PLAN: Plan = DAY_KEYS.reduce((acc, day) => {
  acc[day] = { breakfast: null, lunch: null, dinner: null };
  return acc;
}, {} as Plan);

export default function WeekClient() {
  const [plan, setPlan] = useState<Plan>(EMPTY_PLAN);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [picker, setPicker] = useState<{ day: DayKey; slot: SlotKind } | null>(null);

  const recipesById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);
  const dates = useMemo(() => currentWeekDates(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, r] = await Promise.all([fetchPlan(), fetchRecipes()]);
      if (!cancelled) {
        setPlan(p);
        setRecipes(r);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = weekSummary(plan, recipesById);

  const handleSlotTap = async (day: DayKey, slot: SlotKind) => {
    const recipeId = plan[day][slot];
    if (recipeId) {
      await setPlanSlot(day, slot, null);
      setPlan((prev) => ({ ...prev, [day]: { ...prev[day], [slot]: null } }));
    } else {
      setPicker({ day, slot });
    }
  };

  const handlePick = async (recipe: Recipe) => {
    if (!picker) return;
    const { day, slot } = picker;
    await setPlanSlot(day, slot, recipe.id);
    setPlan((prev) => ({ ...prev, [day]: { ...prev[day], [slot]: recipe.id } }));
    setPicker(null);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-3)] px-[var(--space-4)] pt-[var(--space-3)] pb-8">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div>
          <h1 className="text-[34px] leading-none text-text">{STR.myWeek}</h1>
          <div className="mt-2 text-[12.5px] font-medium text-neutral-600">
            {formatWeekRange(dates)}
          </div>
        </div>
      </div>

      <div className="flex gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-accent-2-200 p-[var(--space-4)]">
        <div>
          <div className="font-heading text-2xl text-accent-2-800">
            {summary.avgProtein}g · {summary.avgCalories}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-[.09em] text-accent-2-700">
            {STR.avgPerDay}
          </div>
        </div>
        <div>
          <div className="font-heading text-2xl text-accent-2-800">
            {summary.slotsFilled}/{summary.slotsTotal}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-[.09em] text-accent-2-700">
            {STR.slotsFilled}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        {DAY_KEYS.map((day) => {
          const s = summary.days.find((d) => d.day === day)!;
          const proteinHigh = s.protein >= 100;
          return (
            <div key={day} className="rounded-[var(--radius-lg)] bg-surface p-[var(--space-3)]">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-heading text-[19px] text-text">
                  {DAY_NAMES[day]}
                </span>
                <div className="flex gap-[var(--space-2)]">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{
                      background: proteinHigh ? "var(--color-accent-2-300)" : "var(--color-accent-200)",
                      color: proteinHigh ? "var(--color-accent-2-800)" : "var(--color-accent-800)",
                    }}
                  >
                    {s.protein}g
                  </span>
                  <span className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-bold text-neutral-700">
                    {s.calories}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                {SLOT_KINDS.map((slot, i) => {
                  const recipeId = plan[day][slot];
                  const recipe = recipeId ? recipesById.get(recipeId) : null;
                  const style = meatStyle(recipe?.meat ?? null);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotTap(day, slot)}
                      className={`flex items-center gap-[var(--space-2)] py-2 text-left ${
                        i > 0 ? "border-t border-[var(--color-divider)]" : ""
                      }`}
                    >
                      <span className="w-4 flex-none text-center text-[11px] font-bold text-neutral-500">
                        {SLOT_LETTERS[slot]}
                      </span>
                      <span
                        className="h-[9px] w-[9px] flex-none rounded-full"
                        style={
                          recipe
                            ? { background: style.bg }
                            : { border: "1.5px dashed var(--color-neutral-400)" }
                        }
                      />
                      <span
                        className={`min-w-0 flex-1 truncate text-[15px] ${
                          recipe ? "font-semibold text-text" : "text-neutral-500"
                        }`}
                      >
                        {recipe?.name ?? STR.addMeal}
                      </span>
                      {recipe ? (
                        <span className="flex-none text-xs text-neutral-600">
                          {recipe.protein}g · {recipe.calories}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {picker ? (
        <RecipePickerSheet
          slot={picker.slot}
          recipes={recipes}
          onPick={handlePick}
          onClose={() => setPicker(null)}
        />
      ) : null}
    </div>
  );
}
