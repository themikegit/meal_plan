"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { RecipeInput } from "@/lib/client";
import { MEAL_TYPES, MEATS, type Meat, type MealType, type Recipe } from "@/lib/types";
import { meatStyle } from "@/lib/meatColor";
import { MEAL_TYPE_LABELS, MEAT_LABELS, STR } from "@/lib/strings";

type DraftIngredient = { qty: string; name: string; perishable: boolean };
type DraftStep = { text: string };

const emptyIngredient = (): DraftIngredient => ({ qty: "", name: "", perishable: true });
const emptyStep = (): DraftStep => ({ text: "" });

const MEAT_REQUIRED_TYPES: MealType[] = ["lunch", "dinner"];

type Props = {
  initial?: Recipe;
  onSubmit: (input: RecipeInput) => Promise<Recipe>;
};

export default function RecipeForm({ initial, onSubmit }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [mealType, setMealType] = useState<MealType>(initial?.meal_type ?? "breakfast");
  const [meat, setMeat] = useState<Meat | null>(initial?.meat ?? null);
  const [name, setName] = useState(initial?.name ?? "");
  const [protein, setProtein] = useState(initial ? String(initial.protein) : "");
  const [calories, setCalories] = useState(initial ? String(initial.calories) : "");
  const [ingredients, setIngredients] = useState<DraftIngredient[]>(
    initial && initial.ingredients.length > 0
      ? initial.ingredients.map((i) => ({ ...i }))
      : [emptyIngredient()],
  );
  const [steps, setSteps] = useState<DraftStep[]>(
    initial && initial.steps.length > 0 ? initial.steps.map((s) => ({ ...s })) : [emptyStep()],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meatRequired = MEAT_REQUIRED_TYPES.includes(mealType);

  const selectMealType = (m: MealType) => {
    setMealType(m);
    if (!MEAT_REQUIRED_TYPES.includes(m)) setMeat(null);
  };

  const updateIngredient = (i: number, patch: Partial<DraftIngredient>) => {
    setIngredients((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };
  const updateStep = (i: number, patch: Partial<DraftStep>) => {
    setSteps((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    if (saving) return;
    setError(null);

    const cleanIngredients = ingredients
      .filter((row) => row.qty.trim() || row.name.trim())
      .map((row) => ({ qty: row.qty.trim(), name: row.name.trim(), perishable: row.perishable }));
    const cleanSteps = steps.filter((row) => row.text.trim()).map((row) => ({ text: row.text.trim() }));

    if (!name.trim()) {
      setError("Naziv je obavezan.");
      return;
    }
    if (meatRequired && !meat) {
      setError("Izaberi vrstu mesa.");
      return;
    }
    if (cleanIngredients.length === 0) {
      setError("Dodaj bar jedan sastojak.");
      return;
    }
    if (cleanSteps.length === 0) {
      setError("Dodaj bar jedan korak.");
      return;
    }

    setSaving(true);
    try {
      const recipe = await onSubmit({
        meal_type: mealType,
        meat: meatRequired ? meat : null,
        name: name.trim(),
        protein: Number.parseFloat(protein) || 0,
        calories: Number.parseFloat(calories) || 0,
        ingredients: cleanIngredients,
        steps: cleanSteps,
      });
      router.push(`/meals/${recipe.id}`);
    } catch (e) {
      setError((e as Error).message || "Čuvanje nije uspelo");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-4)] px-[var(--space-4)] pt-[var(--space-3)] pb-28">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Nazad"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <ArrowLeft size={20} strokeWidth={2.75} />
        </button>
      </div>

      <h1 className="text-[28px] leading-none text-text">{isEdit ? STR.editRecipe : STR.addRecipe}</h1>

      <section className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {STR.mealType.toUpperCase()}
        </label>
        <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
          {MEAL_TYPES.map((m) => (
            <Pill
              key={m}
              active={mealType === m}
              label={MEAL_TYPE_LABELS[m]}
              activeBg="var(--color-accent)"
              activeText="#fff"
              onClick={() => selectMealType(m)}
            />
          ))}
        </div>
      </section>

      {meatRequired ? (
        <section className="flex flex-col gap-[var(--space-2)]">
          <label className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
            {STR.meat.toUpperCase()}
          </label>
          <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
            {MEATS.map((m) => {
              const style = meatStyle(m);
              return (
                <Pill
                  key={m}
                  active={meat === m}
                  label={MEAT_LABELS[m]}
                  activeBg={style.bg}
                  activeText={style.text}
                  onClick={() => setMeat(m)}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-[var(--space-2)]">
        <TextField label={STR.name} value={name} onChange={setName} />
        <div className="flex gap-[var(--space-2)]">
          <TextField label={STR.proteinG} value={protein} onChange={setProtein} inputMode="decimal" />
          <TextField label={STR.kcal.toUpperCase()} value={calories} onChange={setCalories} inputMode="decimal" />
        </div>
      </section>

      <section className="flex flex-col gap-[var(--space-2)]">
        <h2 className="text-[11px] font-bold tracking-[.09em] text-neutral-600">{STR.ingredients}</h2>
        <div className="flex flex-col gap-[var(--space-2)]">
          {ingredients.map((row, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-[var(--radius-md)] bg-surface p-[var(--space-2)]"
            >
              <div className="flex gap-2">
                <input
                  value={row.qty}
                  onChange={(e) => updateIngredient(i, { qty: e.target.value })}
                  placeholder={STR.qty}
                  className="w-20 min-w-0 rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <input
                  value={row.name}
                  onChange={(e) => updateIngredient(i, { name: e.target.value })}
                  placeholder={STR.name}
                  className="min-w-0 flex-1 rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  aria-label="Ukloni sastojak"
                  onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}
                  className="flex-none text-neutral-500 hover:text-accent-700"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
              <label className="flex flex-none items-center gap-1.5 px-1 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={row.perishable}
                  onChange={(e) => updateIngredient(i, { perishable: e.target.checked })}
                />
                {STR.perishable}
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
          className="flex items-center gap-1 self-start rounded-full bg-accent-100 px-3 py-1.5 text-sm font-semibold text-accent-800"
        >
          <Plus size={14} strokeWidth={3} />
          {STR.addIngredient}
        </button>
      </section>

      <section className="flex flex-col gap-[var(--space-2)]">
        <h2 className="text-[11px] font-bold tracking-[.09em] text-neutral-600">{STR.method}</h2>
        <div className="flex flex-col gap-[var(--space-2)]">
          {steps.map((row, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-[var(--radius-md)] bg-surface p-[var(--space-2)]"
            >
              <span className="mt-1.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-[12px] font-bold text-bg">
                {i + 1}
              </span>
              <textarea
                value={row.text}
                onChange={(e) => updateStep(i, { text: e.target.value })}
                placeholder="Korak"
                rows={2}
                className="min-w-0 flex-1 resize-none rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                aria-label="Ukloni korak"
                onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}
                className="mt-1.5 flex-none text-neutral-500 hover:text-accent-700"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((prev) => [...prev, emptyStep()])}
          className="flex items-center gap-1 self-start rounded-full bg-accent-100 px-3 py-1.5 text-sm font-semibold text-accent-800"
        >
          <Plus size={14} strokeWidth={3} />
          {STR.addStep}
        </button>
      </section>

      {error ? <p className="text-sm text-accent-700">{error}</p> : null}

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md gap-[var(--space-2)] border-t border-[var(--color-divider)] bg-surface p-[var(--space-4)] safe-pb">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex-1 rounded-full bg-accent px-[var(--space-4)] py-[18px] text-base font-bold text-bg disabled:opacity-60"
        >
          {saving ? STR.saving : STR.saveRecipe}
        </button>
      </div>
    </div>
  );
}

function Pill({ active, label, activeBg, activeText, onClick }: {
  active: boolean;
  label: string;
  activeBg: string;
  activeText: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-none rounded-full px-[14px] py-[8px] text-sm transition-colors"
      style={
        active
          ? { background: activeBg, color: activeText, fontWeight: 700 }
          : { background: "var(--color-surface)", color: "var(--color-neutral-700)" }
      }
    >
      {label}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "decimal" | "text";
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
        {label.toUpperCase()}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="rounded-[var(--radius-md)] bg-surface px-3 py-2.5 text-[15px] text-text"
      />
    </label>
  );
}
