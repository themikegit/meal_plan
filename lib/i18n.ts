export type Lang = "en" | "sr";

type Dict = Record<string, { en: string; sr: string }>;

export const DAY_NAMES: Dict = {
  mon: { en: "Monday", sr: "Ponedeljak" },
  tue: { en: "Tuesday", sr: "Utorak" },
  wed: { en: "Wednesday", sr: "Sreda" },
  thu: { en: "Thursday", sr: "Četvrtak" },
  fri: { en: "Friday", sr: "Petak" },
  sat: { en: "Saturday", sr: "Subota" },
  sun: { en: "Sunday", sr: "Nedelja" },
};

export const SLOT_LETTERS: Record<string, { en: string; sr: string }> = {
  breakfast: { en: "B", sr: "D" },
  lunch: { en: "L", sr: "R" },
  dinner: { en: "D", sr: "V" },
};

export const MEAT_LABELS: Dict = {
  beef: { en: "Beef", sr: "Govedina" },
  chicken: { en: "Chicken", sr: "Piletina" },
  fish: { en: "Fish", sr: "Riba" },
  lamb: { en: "Lamb", sr: "Janjetina" },
};

export const t = {
  allMeals: { en: "All meals", sr: "Svi obroci" },
  countLine: { en: "recipes · protein first", sr: "recepata · proteini prvo" },
  all: { en: "All", sr: "Sve" },
  addToWeek: { en: "Add to week", sr: "Dodaj u nedelju" },
  addedToWeek: { en: "Added to week ✓", sr: "Dodato u nedelju ✓" },
  servings: { en: "4 SERVINGS", sr: "4 PORCIJE" },
  ingredients: { en: "Ingredients", sr: "Sastojci" },
  method: { en: "Method", sr: "Priprema" },
  protein: { en: "protein", sr: "protein" },
  kcal: { en: "kcal", sr: "kcal" },
  myWeek: { en: "My week", sr: "Moja nedelja" },
  avgPerDay: { en: "AVG / DAY", sr: "PROSEK / DAN" },
  slotsFilled: { en: "SLOTS FILLED", sr: "POPUNJENI TERMINI" },
  addMeal: { en: "Add meal", sr: "Dodaj obrok" },
  groceries: { en: "Groceries", sr: "Namirnice" },
  crossedOff: { en: "of {n} crossed off", sr: "od {n} precrtano" },
  explainer: {
    en: "Split by the day you need it. Crossing off doesn't delete.",
    sr: "Podeljeno po danu kad ti treba. Precrtavanje ne briše.",
  },
  buyFresh: { en: "BUY FRESH", sr: "KUPI SVEŽE" },
  stockUp: { en: "Stock up · any day", sr: "Zalihe · bilo koji dan" },
  meals: { en: "Meals", sr: "Obroci" },
  week: { en: "Week", sr: "Nedelja" },
  pickRecipe: { en: "Pick a recipe", sr: "Izaberi recept" },
  clearSlot: { en: "Clear", sr: "Obriši" },
  addRecipe: { en: "Add recipe", sr: "Dodaj recept" },
  meat: { en: "Meat", sr: "Meso" },
  breakfastOption: { en: "Breakfast (no meat)", sr: "Doručak (bez mesa)" },
  nameEn: { en: "Name (EN)", sr: "Naziv (EN)" },
  nameSr: { en: "Name (SR)", sr: "Naziv (SR)" },
  proteinG: { en: "Protein (g)", sr: "Protein (g)" },
  qty: { en: "Qty", sr: "Količina" },
  perishable: { en: "Perishable", sr: "Kvarljivo" },
  addIngredient: { en: "+ Add ingredient", sr: "+ Dodaj sastojak" },
  addStep: { en: "+ Add step", sr: "+ Dodaj korak" },
  remove: { en: "Remove", sr: "Ukloni" },
  saveRecipe: { en: "Save recipe", sr: "Sačuvaj recept" },
  saving: { en: "Saving…", sr: "Čuvanje…" },
} as const;

export type TKey = keyof typeof t;

export function tr(dict: { en: string; sr: string }, lang: Lang): string {
  return dict[lang];
}
