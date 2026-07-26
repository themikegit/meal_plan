# Meso First

A protein-first meal & grocery planning PWA. Next.js 16 App Router, Clerk auth, Supabase database, deploys to Vercel — same stack as the `fin-ance` project.

## Tech

- **Next.js 16** with App Router & Turbopack (default)
- **Clerk** for auth — note: middleware is now `proxy.ts` in Next 16
- **Supabase** (Postgres) accessed via service-role key from server-only route handlers
- **Tailwind v4** (CSS-first config in `app/globals.css`), tokens ported from the "Organic" design system handoff
- **PWA**: native `app/manifest.ts` + hand-rolled service worker (`public/sw.js`). Registered only in production.

## Setup

1. **Create a Clerk app** at https://dashboard.clerk.com and copy the publishable + secret keys.
2. **Create a Supabase project** at https://supabase.com and copy the project URL + **service_role** key (Settings → API).
3. Copy `.env.local.example` to `.env.local` and fill in the four values from steps 1–2.
4. **Run the SQL** in `supabase/setup.sql` via the Supabase SQL editor to create the tables.
5. **Seed recipes**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm seed
   ```
   (or export both vars from `.env.local` into your shell first, then `pnpm seed`)
6. Install and run:
   ```bash
   pnpm install
   pnpm dev
   ```
   Visit http://localhost:3000 — you'll be redirected to `/sign-in`, then `/meals`.

## Scripts

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — run production build locally
- `pnpm icons` — regenerate placeholder PWA icons (`scripts/generate-icons.mjs`)
- `pnpm seed` — insert the starter recipe set into Supabase (`scripts/seed.mjs`)

## Project structure

```
app/
  layout.tsx              ClerkProvider, LangProvider, PWA meta, BottomNav
  page.tsx                redirect → /meals
  manifest.ts             native Next 16 PWA manifest
  meals/                  screen 01 — browse recipes by meat
  meals/[id]/             screen 02 — recipe detail, add-to-week
  week/                   screen 03 — weekly planner, recipe picker sheet
  groceries/               screen 04 — derived grocery list
  sign-in/[[...sign-in]]/ Clerk SignIn
  sign-up/[[...sign-up]]/ Clerk SignUp
  api/
    recipes/route.ts           GET (global, ?meat= filter)
    recipes/[id]/route.ts      GET
    plan/route.ts               GET (current user's 21 slots)
    plan/[day]/[slot]/route.ts  PATCH (set/clear a slot)
    checked/route.ts            GET, POST (toggle a grocery row on)
    checked/[rowId]/route.ts    DELETE (toggle a grocery row off)

components/  BottomNav, LangProvider/LangToggle, RecipeCard, RecipePickerSheet,
              PhotoPlaceholder, ServiceWorkerRegister
lib/          supabase (server-only admin client), types, client (browser API
              helpers), i18n (EN/SR dictionary), meatColor, plan (summary/
              first-empty-slot helpers), groceries (derive list from plan), week
proxy.ts      Clerk auth gate (Next 16's renamed middleware)
public/sw.js  service worker (shell cache + runtime cache)
public/icons/ placeholder PWA icons — swap for branded ones, then `pnpm icons`
supabase/setup.sql  database schema
supabase/seed sourced from scripts/seed.mjs
```

## Notes

- **Service worker is dev-disabled.** It only registers in production builds so it never caches dev HMR.
- **RLS is enabled with no policies** — anon/authenticated access is denied; only `service_role` (used server-side) can read/write. Defense-in-depth in case the anon key is ever exposed.
- **Recipes are global, seeded data** — not user-editable in the app (matches the design handoff's "not built yet" list).
- **Grocery list is derived, never stored** — it's recomputed client-side from the plan + recipes on every load; only the checked/unchecked state persists (`grocery_checks`).
- **i18n**: `lang` toggle (EN/SR, Serbian in Latin script) persists to `localStorage` only — it's a per-device UI preference, not account data.
- The recipe "heart" (favorite) button is decorative, matching the design handoff.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import on Vercel.
3. Add all `.env.local` vars in the Vercel project settings → Environment Variables.
4. Deploy. No special config needed.

Once deployed, in the Clerk dashboard add your Vercel URL to allowed origins and update the sign-in URL to your production domain.
