export const DAY_NAMES: Record<string, string> = {
  mon: "Ponedeljak",
  tue: "Utorak",
  wed: "Sreda",
  thu: "Četvrtak",
  fri: "Petak",
  sat: "Subota",
  sun: "Nedelja",
};

export const SLOT_LETTERS: Record<string, string> = {
  breakfast: "D",
  lunch: "R",
  dinner: "V",
};

export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Doručak",
  lunch: "Ručak",
  dinner: "Večera",
  snack: "Snek",
};

export const MEAT_LABELS: Record<string, string> = {
  red_meat: "Crveno meso",
  poultry: "Perutnina",
  fish: "Riba",
  vege: "Vege",
};

export const STR = {
  all: "Sve",
  countLine: "recepata",
  addToWeek: "Dodaj u nedelju",
  addedToWeek: "Dodato u nedelju ✓",
  servings: "4 PORCIJE",
  ingredients: "Sastojci",
  method: "Priprema",
  protein: "protein",
  kcal: "kcal",
  myWeek: "Moja nedelja",
  avgPerDay: "PROSEK / DAN",
  slotsFilled: "POPUNJENI TERMINI",
  addMeal: "Dodaj obrok",
  groceries: "Namirnice",
  crossedOffOf: "od",
  crossedOffSuffix: "precrtano",
  explainer: "Podeljeno po danu kad ti treba. Precrtavanje ne briše.",
  buyFresh: "KUPI SVEŽE",
  stockUp: "Zalihe · bilo koji dan",
  meals: "Obroci",
  week: "Nedelja",
  pickRecipe: "Izaberi recept",
  clearSlot: "Obriši",
  addRecipe: "Dodaj recept",
  editRecipe: "Izmeni recept",
  mealType: "Tip obroka",
  meat: "Meso",
  name: "Naziv",
  proteinG: "Protein (g)",
  qty: "Količina",
  perishable: "Kvarljivo",
  addIngredient: "+ Dodaj sastojak",
  addStep: "+ Dodaj korak",
  saveRecipe: "Sačuvaj recept",
  saving: "Čuvanje…",
} as const;
