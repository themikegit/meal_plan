export type Meat = "beef" | "chicken" | "fish" | "lamb";
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type SlotKind = "breakfast" | "lunch" | "dinner";

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const SLOT_KINDS: SlotKind[] = ["breakfast", "lunch", "dinner"];
export const MEATS: Meat[] = ["beef", "chicken", "fish", "lamb"];

export type Ingredient = {
  qty: string;
  name_en: string;
  name_sr: string;
  perishable: boolean;
};

export type Step = {
  en: string;
  sr: string;
};

export type Recipe = {
  id: string;
  meat: Meat | null;
  name_en: string;
  name_sr: string;
  protein: number;
  calories: number;
  time_min: number;
  ingredients: Ingredient[];
  steps: Step[];
};

export type PlanSlot = {
  day_key: DayKey;
  slot: SlotKind;
  recipe_id: string | null;
};

export type Plan = Record<DayKey, Record<SlotKind, string | null>>;
