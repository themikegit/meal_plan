import type { Meat } from "./types";

type MeatStyle = {
  bg: string;
  text: string;
  ink: boolean;
};

// Ramp step per the handoff: beef accent-700, chicken accent-500,
// fish accent-2-700, lamb accent-2-500 (lamb uses an ink label, not white).
const MEAT_STYLES: Record<Meat, MeatStyle> = {
  beef: { bg: "var(--color-accent-700)", text: "#fff", ink: false },
  chicken: { bg: "var(--color-accent-500)", text: "#fff", ink: false },
  fish: { bg: "var(--color-accent-2-700)", text: "#fff", ink: false },
  lamb: { bg: "var(--color-accent-2-500)", text: "var(--color-text)", ink: true },
};

export function meatStyle(meat: Meat | null): MeatStyle {
  if (!meat) return { bg: "var(--color-accent)", text: "#fff", ink: false };
  return MEAT_STYLES[meat];
}
