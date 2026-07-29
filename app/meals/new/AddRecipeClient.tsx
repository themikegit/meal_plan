"use client";

import RecipeForm from "@/components/RecipeForm";
import { createRecipe } from "@/lib/client";

export default function AddRecipeClient() {
  return <RecipeForm onSubmit={createRecipe} />;
}
