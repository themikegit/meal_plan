import { MEAL_TYPES, MEATS, type Ingredient, type Step } from "./types";

export const MEAT_REQUIRED_TYPES = new Set(["lunch", "dinner"]);

export type ParsedRecipeInput = {
  meal_type: string;
  meat: string | null;
  name: string;
  protein: number;
  calories: number;
  ingredients: Ingredient[];
  steps: Step[];
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function parseIngredients(v: unknown): Ingredient[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out: Ingredient[] = [];
  for (const row of v) {
    const r = row as Record<string, unknown>;
    if (!isNonEmptyString(r.qty) || !isNonEmptyString(r.name)) return null;
    out.push({
      qty: r.qty.trim(),
      name: r.name.trim(),
      perishable: Boolean(r.perishable),
    });
  }
  return out;
}

function parseSteps(v: unknown): Step[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out: Step[] = [];
  for (const row of v) {
    const r = row as Record<string, unknown>;
    if (!isNonEmptyString(r.text)) return null;
    out.push({ text: r.text.trim() });
  }
  return out;
}

export function parseRecipeInput(body: unknown): ParsedRecipeInput | { error: string } {
  const { meal_type, meat, name, protein, calories, ingredients, steps } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (!(MEAL_TYPES as string[]).includes(meal_type as string)) {
    return { error: "invalid_meal_type" };
  }
  const meatRequired = MEAT_REQUIRED_TYPES.has(meal_type as string);
  if (meatRequired) {
    if (!(MEATS as string[]).includes(meat as string)) {
      return { error: "invalid_meat" };
    }
  } else if (meat !== null && meat !== undefined) {
    return { error: "invalid_meat" };
  }
  if (!isNonEmptyString(name)) {
    return { error: "invalid_name" };
  }
  const numericProtein = typeof protein === "number" ? protein : Number.parseFloat(String(protein));
  const numericCalories = typeof calories === "number" ? calories : Number.parseFloat(String(calories));
  if (!Number.isFinite(numericProtein) || numericProtein < 0) {
    return { error: "invalid_protein" };
  }
  if (!Number.isFinite(numericCalories) || numericCalories < 0) {
    return { error: "invalid_calories" };
  }
  const parsedIngredients = parseIngredients(ingredients);
  if (!parsedIngredients) {
    return { error: "invalid_ingredients" };
  }
  const parsedSteps = parseSteps(steps);
  if (!parsedSteps) {
    return { error: "invalid_steps" };
  }

  return {
    meal_type: meal_type as string,
    meat: meatRequired ? (meat as string) : null,
    name: (name as string).trim(),
    protein: numericProtein,
    calories: numericCalories,
    ingredients: parsedIngredients,
    steps: parsedSteps,
  };
}
