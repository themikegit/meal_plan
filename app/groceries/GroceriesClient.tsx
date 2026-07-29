"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { fetchChecked, fetchPlan, fetchRecipes, setChecked } from "@/lib/client";
import type { Plan, Recipe } from "@/lib/types";
import { buildGroceryList } from "@/lib/groceries";
import { meatStyle } from "@/lib/meatColor";
import { DAY_NAMES, SLOT_LETTERS, STR } from "@/lib/strings";

export default function GroceriesClient() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [checked, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const [p, r, c] = await Promise.all([fetchPlan(), fetchRecipes(), fetchChecked()]);
      setPlan(p);
      setRecipes(r);
      setCheckedIds(new Set(c));
    })();
  }, []);

  const recipesById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);
  const list = useMemo(
    () => (plan ? buildGroceryList(plan, recipesById) : { freshGroups: [], pantry: [] }),
    [plan, recipesById],
  );

  const totalRows =
    list.freshGroups.reduce((sum, g) => sum + g.rows.length, 0) + list.pantry.length;
  const checkedCount = [
    ...list.freshGroups.flatMap((g) => g.rows.map((r) => r.rowId)),
    ...list.pantry.map((p) => p.rowId),
  ].filter((id) => checked.has(id)).length;

  const toggle = async (rowId: string) => {
    const isChecked = checked.has(rowId);
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (isChecked) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
    await setChecked(rowId, !isChecked);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-3)] px-[var(--space-4)] pt-[var(--space-3)] pb-8">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div>
          <h1 className="text-[34px] leading-none text-text">{STR.groceries}</h1>
          <div className="mt-2 text-[12.5px] font-medium text-neutral-600">
            {checkedCount} {STR.crossedOffOf} {totalRows} {STR.crossedOffSuffix}
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-accent-100 p-[var(--space-3)] text-sm text-accent-800">
        {STR.explainer}
      </div>

      {list.freshGroups.map((group) => (
        <div key={group.dayKey} className="flex flex-col gap-[var(--space-2)]">
          <div className="flex items-center gap-[var(--space-2)]">
            <span className="rounded-full bg-accent-2-200 px-2.5 py-0.5 text-[10px] font-bold tracking-[.08em] text-accent-2-800">
              {STR.buyFresh}
            </span>
            <span className="font-heading text-base text-text">{DAY_NAMES[group.dayKey]}</span>
            <span className="text-xs text-neutral-600">{group.rows.length}</span>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-surface p-[var(--space-2)]">
            {group.rows.map((row, i) => (
              <GroceryRow
                key={row.rowId}
                qty={row.qty}
                name={row.name}
                checked={checked.has(row.rowId)}
                onToggle={() => toggle(row.rowId)}
                divider={i > 0}
                tag={{ label: SLOT_LETTERS[row.slot], style: meatStyle(row.meat) }}
              />
            ))}
          </div>
        </div>
      ))}

      {list.pantry.length > 0 ? (
        <div className="flex flex-col gap-[var(--space-2)]">
          <span className="font-heading text-base text-text">{STR.stockUp}</span>
          <div className="rounded-[var(--radius-lg)] bg-surface p-[var(--space-2)]">
            {list.pantry.map((row, i) => (
              <GroceryRow
                key={row.rowId}
                qty={row.count > 1 ? `${row.qty} ×${row.count}` : row.qty}
                name={row.name}
                checked={checked.has(row.rowId)}
                onToggle={() => toggle(row.rowId)}
                divider={i > 0}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GroceryRow({
  qty,
  name,
  checked,
  onToggle,
  divider,
  tag,
}: {
  qty: string;
  name: string;
  checked: boolean;
  onToggle: () => void;
  divider: boolean;
  tag?: { label: string; style: { bg: string; text: string } };
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-[var(--space-2)] py-2.5 text-left transition-opacity ${
        divider ? "border-t border-[var(--color-divider)]" : ""
      } ${checked ? "opacity-50" : ""}`}
    >
      <span
        className="flex h-5 w-5 flex-none items-center justify-center rounded-full"
        style={
          checked
            ? { background: "var(--color-accent-2-500)" }
            : { border: "1.5px solid var(--color-divider)" }
        }
      >
        {checked ? <Check size={13} strokeWidth={3} color="#fff" /> : null}
      </span>
      <span
        className={`min-w-[64px] flex-none text-[12.5px] font-bold text-accent-700 ${checked ? "line-through" : ""}`}
      >
        {qty}
      </span>
      <span className={`min-w-0 flex-1 truncate text-[15px] text-text ${checked ? "line-through" : ""}`}>
        {name}
      </span>
      {tag ? (
        <span
          className="flex-none rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: tag.style.bg, color: tag.style.text }}
        >
          {tag.label}
        </span>
      ) : null}
    </button>
  );
}
