"use client";

import type { DayKey, Ingredient, Meat, MealType, Plan, Recipe, SlotKind, Step } from "./types";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `request_failed_${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchRecipes(meat?: string | null): Promise<Recipe[]> {
  const url = meat ? `/api/recipes?meat=${encodeURIComponent(meat)}` : "/api/recipes";
  const res = await fetch(url, { cache: "no-store" });
  const data = await jsonOrThrow<{ recipes: Recipe[] }>(res);
  return data.recipes;
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${id}`, { cache: "no-store" });
  const data = await jsonOrThrow<{ recipe: Recipe }>(res);
  return data.recipe;
}

export async function createRecipe(input: {
  meal_type: MealType;
  meat: Meat | null;
  name: string;
  protein: number;
  calories: number;
  ingredients: Ingredient[];
  steps: Step[];
}): Promise<Recipe> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await jsonOrThrow<{ recipe: Recipe }>(res);
  return data.recipe;
}

export async function fetchPlan(): Promise<Plan> {
  const res = await fetch("/api/plan", { cache: "no-store" });
  const data = await jsonOrThrow<{ plan: Plan }>(res);
  return data.plan;
}

export async function setPlanSlot(
  day: DayKey,
  slot: SlotKind,
  recipeId: string | null,
): Promise<void> {
  const res = await fetch(`/api/plan/${day}/${slot}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe_id: recipeId }),
  });
  await jsonOrThrow<{ ok: true }>(res);
}

export async function fetchChecked(): Promise<string[]> {
  const res = await fetch("/api/checked", { cache: "no-store" });
  const data = await jsonOrThrow<{ checked: string[] }>(res);
  return data.checked;
}

export async function setChecked(rowId: string, checked: boolean): Promise<void> {
  const res = checked
    ? await fetch("/api/checked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row_id: rowId }),
      })
    : await fetch(`/api/checked/${encodeURIComponent(rowId)}`, { method: "DELETE" });
  await jsonOrThrow<{ ok: true }>(res);
}
