import type { Meat } from "./types";

type MeatStyle = {
  bg: string;
  text: string;
  ink: boolean;
};

// Red meat takes the old "beef" slot, poultry the old "chicken" slot, fish
// stays put, vege takes the sage ramp (ink label, not white).
const MEAT_STYLES: Record<Meat, MeatStyle> = {
  red_meat: { bg: "var(--color-accent-700)", text: "#fff", ink: false },
  poultry: { bg: "var(--color-accent-500)", text: "#fff", ink: false },
  fish: { bg: "var(--color-accent-2-700)", text: "#fff", ink: false },
  vege: { bg: "var(--color-accent-2-500)", text: "var(--color-text)", ink: true },
};

export function meatStyle(meat: Meat | null): MeatStyle {
  if (!meat) return { bg: "var(--color-accent)", text: "#fff", ink: false };
  return MEAT_STYLES[meat];
}
