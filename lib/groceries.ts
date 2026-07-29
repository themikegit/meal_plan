import { DAY_KEYS, SLOT_KINDS, type DayKey, type Plan, type Recipe, type SlotKind } from "./types";

export type FreshRow = {
  rowId: string;
  qty: string;
  name: string;
  slot: SlotKind;
  meat: Recipe["meat"];
};

export type FreshGroup = {
  dayKey: DayKey;
  rows: FreshRow[];
};

export type PantryRow = {
  rowId: string;
  qty: string;
  name: string;
  count: number;
};

export type GroceryList = {
  freshGroups: FreshGroup[];
  pantry: PantryRow[];
};

export function buildGroceryList(plan: Plan, recipesById: Map<string, Recipe>): GroceryList {
  const freshGroups: FreshGroup[] = [];
  const pantryMap = new Map<string, PantryRow>();

  for (const dayKey of DAY_KEYS) {
    const rows: FreshRow[] = [];
    for (const slot of SLOT_KINDS) {
      const recipeId = plan[dayKey]?.[slot];
      if (!recipeId) continue;
      const recipe = recipesById.get(recipeId);
      if (!recipe) continue;

      recipe.ingredients.forEach((ing, index) => {
        if (ing.perishable) {
          rows.push({
            rowId: `${dayKey}${slot}${index}`,
            qty: ing.qty,
            name: ing.name,
            slot,
            meat: recipe.meat,
          });
        } else {
          const key = `p-${ing.name}`;
          const existing = pantryMap.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            pantryMap.set(key, {
              rowId: key,
              qty: ing.qty,
              name: ing.name,
              count: 1,
            });
          }
        }
      });
    }
    if (rows.length > 0) freshGroups.push({ dayKey, rows });
  }

  return { freshGroups, pantry: Array.from(pantryMap.values()) };
}
