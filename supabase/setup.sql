-- Run this in the Supabase SQL editor for your project.
-- Recipes are global seed data; plan_slots and grocery_checks are scoped to
-- Clerk user IDs, mirroring the fin-ance project's expenses/incomes pattern.

create extension if not exists "pgcrypto";

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  meat text check (meat in ('beef','chicken','fish','lamb')), -- null = breakfast item
  name_en text not null,
  name_sr text not null,
  protein numeric not null,
  calories integer not null,
  time_min integer not null,
  ingredients jsonb not null, -- [{ qty, name_en, name_sr, perishable }]
  steps jsonb not null,       -- [{ en, sr }]
  created_at timestamptz not null default now()
);

create table if not exists public.plan_slots (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  day_key text not null check (day_key in ('mon','tue','wed','thu','fri','sat','sun')),
  slot text not null check (slot in ('breakfast','lunch','dinner')),
  recipe_id uuid references public.recipes(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (user_id, day_key, slot)
);
create index if not exists plan_slots_user_id_idx on public.plan_slots (user_id);

create table if not exists public.grocery_checks (
  user_id text not null,
  row_id text not null, -- `${dayKey}${slot}${ingredientIndex}` fresh rows, `p-${nameEn}` pantry rows
  created_at timestamptz not null default now(),
  primary key (user_id, row_id)
);

-- We authenticate via Clerk and access Supabase using the service role key
-- from server-side route handlers only. RLS is therefore not relied on, but
-- enabling it with a deny-by-default policy is good defense-in-depth: if the
-- anon key is ever exposed to a client by mistake, no rows leak.
alter table public.recipes        enable row level security;
alter table public.plan_slots     enable row level security;
alter table public.grocery_checks enable row level security;

-- No policies = deny all to anon / authenticated. service_role bypasses RLS.
