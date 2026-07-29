export type Meat = "red_meat" | "poultry" | "fish" | "vege";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type SlotKind = "breakfast" | "lunch" | "dinner";

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const SLOT_KINDS: SlotKind[] = ["breakfast", "lunch", "dinner"];
export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
export const MEATS: Meat[] = ["red_meat", "poultry", "fish", "vege"];

export type Ingredient = {
  qty: string;
  name: string;
  perishable: boolean;
};

export type Step = {
  text: string;
};

export type Recipe = {
  id: string;
  meal_type: MealType;
  meat: Meat | null;
  name: string;
  protein: number;
  calories: number;
  ingredients: Ingredient[];
  steps: Step[];
};

export type PlanSlot = {
  day_key: DayKey;
  slot: SlotKind;
  recipe_id: string | null;
};

export type Plan = Record<DayKey, Record<SlotKind, string | null>>;
