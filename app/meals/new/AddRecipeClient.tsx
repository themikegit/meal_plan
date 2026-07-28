"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { createRecipe } from "@/lib/client";
import { MEATS, type Ingredient, type Meat, type Step } from "@/lib/types";
import { useLang } from "@/components/LangProvider";
import LangToggle from "@/components/LangToggle";
import { MEAT_LABELS, t, tr } from "@/lib/i18n";

type DraftIngredient = { qty: string; name_en: string; name_sr: string; perishable: boolean };
type DraftStep = { en: string; sr: string };

const emptyIngredient = (): DraftIngredient => ({ qty: "", name_en: "", name_sr: "", perishable: true });
const emptyStep = (): DraftStep => ({ en: "", sr: "" });

export default function AddRecipeClient() {
  const router = useRouter();
  const { lang } = useLang();

  const [meat, setMeat] = useState<Meat | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameSr, setNameSr] = useState("");
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");
  const [ingredients, setIngredients] = useState<DraftIngredient[]>([emptyIngredient()]);
  const [steps, setSteps] = useState<DraftStep[]>([emptyStep()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateIngredient = (i: number, patch: Partial<DraftIngredient>) => {
    setIngredients((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };
  const updateStep = (i: number, patch: Partial<DraftStep>) => {
    setSteps((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    if (saving) return;
    setError(null);

    const cleanIngredients: Ingredient[] = ingredients
      .filter((row) => row.qty.trim() || row.name_en.trim() || row.name_sr.trim())
      .map((row) => ({
        qty: row.qty.trim(),
        name_en: row.name_en.trim(),
        name_sr: row.name_sr.trim(),
        perishable: row.perishable,
      }));
    const cleanSteps: Step[] = steps
      .filter((row) => row.en.trim() || row.sr.trim())
      .map((row) => ({ en: row.en.trim(), sr: row.sr.trim() }));

    if (!nameEn.trim() || !nameSr.trim()) {
      setError("Name (EN and SR) is required.");
      return;
    }
    if (cleanIngredients.length === 0) {
      setError("Add at least one ingredient.");
      return;
    }
    if (cleanSteps.length === 0) {
      setError("Add at least one step.");
      return;
    }

    setSaving(true);
    try {
      const recipe = await createRecipe({
        meat,
        name_en: nameEn.trim(),
        name_sr: nameSr.trim(),
        protein: Number.parseFloat(protein) || 0,
        calories: Number.parseFloat(calories) || 0,
        ingredients: cleanIngredients,
        steps: cleanSteps,
      });
      router.push(`/meals/${recipe.id}`);
    } catch (e) {
      setError((e as Error).message || "Failed to save");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-[var(--space-4)] px-[var(--space-4)] pt-[var(--space-3)] pb-28">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <ArrowLeft size={20} strokeWidth={2.75} />
        </button>
        <LangToggle />
      </div>

      <h1 className="text-[28px] leading-none text-text">{tr(t.addRecipe, lang)}</h1>

      <section className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {tr(t.meat, lang).toUpperCase()}
        </label>
        <div className="flex gap-[var(--space-2)] overflow-x-auto pb-1">
          <MeatPill
            active={meat === null}
            label={tr(t.breakfastOption, lang)}
            onClick={() => setMeat(null)}
          />
          {MEATS.map((m) => (
            <MeatPill
              key={m}
              active={meat === m}
              label={tr(MEAT_LABELS[m], lang)}
              onClick={() => setMeat(m)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[var(--space-2)]">
        <TextField label={tr(t.nameEn, lang)} value={nameEn} onChange={setNameEn} />
        <TextField label={tr(t.nameSr, lang)} value={nameSr} onChange={setNameSr} />
        <div className="flex gap-[var(--space-2)]">
          <TextField
            label={tr(t.proteinG, lang)}
            value={protein}
            onChange={setProtein}
            inputMode="decimal"
          />
          <TextField
            label={tr(t.kcal, lang).toUpperCase()}
            value={calories}
            onChange={setCalories}
            inputMode="decimal"
          />
        </div>
      </section>

      <section className="flex flex-col gap-[var(--space-2)]">
        <h2 className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {tr(t.ingredients, lang)}
        </h2>
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
                  placeholder={tr(t.qty, lang)}
                  className="w-20 min-w-0 rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <input
                  value={row.name_en}
                  onChange={(e) => updateIngredient(i, { name_en: e.target.value })}
                  placeholder={tr(t.nameEn, lang)}
                  className="min-w-0 flex-1 rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  aria-label="Remove ingredient"
                  onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}
                  className="flex-none text-neutral-500 hover:text-accent-700"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={row.name_sr}
                  onChange={(e) => updateIngredient(i, { name_sr: e.target.value })}
                  placeholder={tr(t.nameSr, lang)}
                  className="min-w-0 flex-1 rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <label className="flex flex-none items-center gap-1.5 px-1 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={row.perishable}
                    onChange={(e) => updateIngredient(i, { perishable: e.target.checked })}
                  />
                  {tr(t.perishable, lang)}
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
          className="flex items-center gap-1 self-start rounded-full bg-accent-100 px-3 py-1.5 text-sm font-semibold text-accent-800"
        >
          <Plus size={14} strokeWidth={3} />
          {tr(t.addIngredient, lang)}
        </button>
      </section>

      <section className="flex flex-col gap-[var(--space-2)]">
        <h2 className="text-[11px] font-bold tracking-[.09em] text-neutral-600">
          {tr(t.method, lang)}
        </h2>
        <div className="flex flex-col gap-[var(--space-2)]">
          {steps.map((row, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-[var(--radius-md)] bg-surface p-[var(--space-2)]"
            >
              <div className="flex items-start gap-2">
                <span className="mt-1.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-[12px] font-bold text-bg">
                  {i + 1}
                </span>
                <textarea
                  value={row.en}
                  onChange={(e) => updateStep(i, { en: e.target.value })}
                  placeholder={`${tr(t.nameEn, lang)} step`}
                  rows={2}
                  className="min-w-0 flex-1 resize-none rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  aria-label="Remove step"
                  onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}
                  className="mt-1.5 flex-none text-neutral-500 hover:text-accent-700"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
              <textarea
                value={row.sr}
                onChange={(e) => updateStep(i, { sr: e.target.value })}
                placeholder={`${tr(t.nameSr, lang)} step`}
                rows={2}
                className="ml-8 min-w-0 resize-none rounded-[var(--radius-sm)] bg-bg px-2 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((prev) => [...prev, emptyStep()])}
          className="flex items-center gap-1 self-start rounded-full bg-accent-100 px-3 py-1.5 text-sm font-semibold text-accent-800"
        >
          <Plus size={14} strokeWidth={3} />
          {tr(t.addStep, lang)}
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
          {saving ? tr(t.saving, lang) : tr(t.saveRecipe, lang)}
        </button>
      </div>
    </div>
  );
}

function MeatPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-none rounded-full px-[14px] py-[8px] text-sm transition-colors"
      style={
        active
          ? { background: "var(--color-accent)", color: "var(--color-bg)", fontWeight: 700 }
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
