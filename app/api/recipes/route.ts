import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MEATS, type Ingredient, type Step } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sb = getSupabaseAdmin();
  const meat = new URL(req.url).searchParams.get("meat");

  let query = sb.from("recipes").select("*").order("name_en", { ascending: true });
  if (meat && (MEATS as string[]).includes(meat)) {
    query = query.eq("meat", meat);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipes: data ?? [] });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function parseIngredients(v: unknown): Ingredient[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out: Ingredient[] = [];
  for (const row of v) {
    const r = row as Record<string, unknown>;
    if (!isNonEmptyString(r.qty) || !isNonEmptyString(r.name_en) || !isNonEmptyString(r.name_sr)) {
      return null;
    }
    out.push({
      qty: r.qty.trim(),
      name_en: r.name_en.trim(),
      name_sr: r.name_sr.trim(),
      perishable: Boolean(r.perishable),
    });
  }
  return out;
}

function parseSteps(v: unknown): Step[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out: Step[] = [];
  for (const row of v) {
    const r = row as Record<string, unknown>;
    if (!isNonEmptyString(r.en) || !isNonEmptyString(r.sr)) return null;
    out.push({ en: r.en.trim(), sr: r.sr.trim() });
  }
  return out;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { meat, name_en, name_sr, protein, calories, ingredients, steps } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (meat !== null && !(MEATS as string[]).includes(meat as string)) {
    return NextResponse.json({ error: "invalid_meat" }, { status: 400 });
  }
  if (!isNonEmptyString(name_en) || !isNonEmptyString(name_sr)) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  const numericProtein = typeof protein === "number" ? protein : Number.parseFloat(String(protein));
  const numericCalories = typeof calories === "number" ? calories : Number.parseFloat(String(calories));
  if (!Number.isFinite(numericProtein) || numericProtein < 0) {
    return NextResponse.json({ error: "invalid_protein" }, { status: 400 });
  }
  if (!Number.isFinite(numericCalories) || numericCalories < 0) {
    return NextResponse.json({ error: "invalid_calories" }, { status: 400 });
  }
  const parsedIngredients = parseIngredients(ingredients);
  if (!parsedIngredients) {
    return NextResponse.json({ error: "invalid_ingredients" }, { status: 400 });
  }
  const parsedSteps = parseSteps(steps);
  if (!parsedSteps) {
    return NextResponse.json({ error: "invalid_steps" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("recipes")
    .insert({
      meat: meat ?? null,
      name_en: (name_en as string).trim(),
      name_sr: (name_sr as string).trim(),
      protein: numericProtein,
      calories: numericCalories,
      ingredients: parsedIngredients,
      steps: parsedSteps,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipe: data }, { status: 201 });
}
