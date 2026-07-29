"use client";

import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import { MEAT_LABELS, STR } from "@/lib/strings";
import PhotoPlaceholder from "./PhotoPlaceholder";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const style = meatStyle(recipe.meat);

  return (
    <button
      type="button"
      onClick={() => router.push(`/meals/${recipe.id}`)}
      className="flex gap-[var(--space-3)] items-stretch rounded-[var(--radius-lg)] bg-surface p-[var(--space-3)] text-left shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
    >
      <PhotoPlaceholder className="w-[86px] flex-none rounded-[var(--radius-md)]" tint={style.bg} />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          {recipe.meat ? (
            <span
              className="inline-flex rounded-[calc(var(--radius-md)*0.75)] px-2.5 py-0.5 text-[10px] font-bold tracking-[.1em] uppercase"
              style={{ background: style.bg, color: style.text }}
            >
              {MEAT_LABELS[recipe.meat]}
            </span>
          ) : null}
          <div className="mt-[9px] font-heading text-[19px] leading-[1.12] text-text text-pretty">
            {recipe.name}
          </div>
        </div>
        <div className="mt-2.5 flex gap-[var(--space-3)] text-xs font-medium text-neutral-600">
          <span style={{ color: style.bg, fontWeight: 700 }}>
            {recipe.protein}g {STR.protein}
          </span>
          <span>{recipe.calories} {STR.kcal}</span>
        </div>
      </div>
    </button>
  );
}
