import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MEATS } from "@/lib/types";

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
