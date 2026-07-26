import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DAY_KEYS, type Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("plan_slots")
    .select("day_key, slot, recipe_id")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const plan = {} as Plan;
  for (const day of DAY_KEYS) {
    plan[day] = { breakfast: null, lunch: null, dinner: null };
  }
  for (const row of data ?? []) {
    plan[row.day_key as keyof Plan][row.slot as keyof Plan["mon"]] = row.recipe_id;
  }

  return NextResponse.json({ plan });
}
