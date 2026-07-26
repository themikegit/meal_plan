import { DAY_KEYS, SLOT_KINDS, type DayKey, type Plan, type Recipe, type SlotKind } from "./types";

export function firstEmptySlot(plan: Plan, slot: SlotKind): DayKey | null {
  for (const day of DAY_KEYS) {
    if (!plan[day]?.[slot]) return day;
  }
  return null;
}

export type DaySummary = {
  day: DayKey;
  protein: number;
  calories: number;
  filled: number;
};

export function daySummary(plan: Plan, recipesById: Map<string, Recipe>, day: DayKey): DaySummary {
  let protein = 0;
  let calories = 0;
  let filled = 0;
  for (const slot of SLOT_KINDS) {
    const recipeId = plan[day]?.[slot];
    if (!recipeId) continue;
    const recipe = recipesById.get(recipeId);
    if (!recipe) continue;
    protein += recipe.protein;
    calories += recipe.calories;
    filled += 1;
  }
  return { day, protein, calories, filled };
}

export function weekSummary(plan: Plan, recipesById: Map<string, Recipe>) {
  const days = DAY_KEYS.map((day) => daySummary(plan, recipesById, day));
  const totalFilled = days.reduce((sum, d) => sum + d.filled, 0);
  const avgProtein = days.reduce((sum, d) => sum + d.protein, 0) / DAY_KEYS.length;
  const avgCalories = days.reduce((sum, d) => sum + d.calories, 0) / DAY_KEYS.length;
  return {
    days,
    avgProtein: Math.round(avgProtein),
    avgCalories: Math.round(avgCalories),
    slotsFilled: totalFilled,
    slotsTotal: DAY_KEYS.length * SLOT_KINDS.length,
  };
}
