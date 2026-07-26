import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DAY_KEYS, SLOT_KINDS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ day: string; slot: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { day, slot } = await params;
  if (!(DAY_KEYS as string[]).includes(day)) {
    return NextResponse.json({ error: "invalid_day" }, { status: 400 });
  }
  if (!(SLOT_KINDS as string[]).includes(slot)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { recipe_id } = (body ?? {}) as { recipe_id?: unknown };
  if (recipe_id !== null && typeof recipe_id !== "string") {
    return NextResponse.json({ error: "invalid_recipe_id" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();

  if (recipe_id) {
    const { data: recipe, error: rErr } = await sb
      .from("recipes")
      .select("id")
      .eq("id", recipe_id)
      .maybeSingle();
    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });
    if (!recipe) return NextResponse.json({ error: "recipe_not_found" }, { status: 400 });
  }

  const { error } = await sb.from("plan_slots").upsert(
    {
      user_id: userId,
      day_key: day,
      slot,
      recipe_id: recipe_id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day_key,slot" },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
