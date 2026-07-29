"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import type { Recipe, SlotKind } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import { STR } from "@/lib/strings";

type Props = {
  slot: SlotKind;
  recipes: Recipe[];
  onPick: (recipe: Recipe) => void;
  onClose: () => void;
};

export default function RecipePickerSheet({ slot, recipes, onPick, onClose }: Props) {
  const options = useMemo(() => recipes.filter((r) => r.meal_type === slot), [recipes, slot]);

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[75vh] max-w-md flex-col gap-[var(--space-3)] rounded-t-[var(--radius-lg)] bg-bg p-[var(--space-4)] pb-8 shadow-[var(--shadow-lg)] animate-slide-up safe-pb">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-text">{STR.pickRecipe}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-600 hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-[var(--space-2)] overflow-y-auto">
          {options.map((recipe) => {
            const style = meatStyle(recipe.meat);
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => onPick(recipe)}
                className="flex items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] bg-surface px-[var(--space-3)] py-[var(--space-2)] text-left"
              >
                <span className="text-[15px] font-semibold text-text">{recipe.name}</span>
                <span className="text-xs font-bold" style={{ color: style.bg }}>
                  {recipe.protein}g
                </span>
              </button>
            );
          })}
          {options.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-600">—</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
