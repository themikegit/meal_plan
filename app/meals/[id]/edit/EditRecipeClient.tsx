"use client";

import { useEffect, useState } from "react";
import RecipeForm from "@/components/RecipeForm";
import { fetchRecipe, updateRecipe } from "@/lib/client";
import type { Recipe } from "@/lib/types";

export default function EditRecipeClient({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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

  return <RecipeForm initial={recipe} onSubmit={(input) => updateRecipe(id, input)} />;
}
