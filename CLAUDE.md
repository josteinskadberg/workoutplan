# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # next dev on http://localhost:3000
npm run build       # next build (production)
npm run start       # serve the production build
npm run lint        # next lint
npm run typecheck   # tsc --noEmit
```

There is no test suite.

Three env vars are required at runtime (not at build) — set them in `.env.local` for `npm run dev`:

- `APP_PASSWORD` — the shared password gating the site
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis credentials (legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN` are also accepted as fallback)

Without those, the dev server still starts but middleware throws on the first authenticated request and Redis calls fail open with `emptyData()`.

## Architecture

**Single-page-style tracker for a fixed 6-week workout program**, deployed to Vercel.

### Static plan vs. user data

The workout program (4 days × 6 weeks, exercise list, phase scheme, warm-up, markers) is fully static and lives in `lib/plan.ts` — it never changes at runtime. Only user-entered logs live in storage.

User data is stored as **a single JSON blob under one Redis key** (`workout:data` in `lib/kv.ts`). The shape is `WorkoutData` (see `lib/types.ts`):

```
sessions: { [`w${week}-d${day}`]: { date, exercises: { [exerciseId]: { sets, notes } }, sessionNotes } }
markers:  { [`wk${week}`]:        { [markerId]: string } }
baseline: { [markerId]: string }
updatedAt: ISO timestamp
```

The client `GET`s the whole blob on page load (server-rendered via `getData()`) and `PUT`s the whole blob on save (`/api/data` PUT). The payload is small enough that diffing/patching wasn't worth it. There's no per-field write API.

### Auth (Edge-compatible)

`middleware.ts` runs on the **Edge runtime**, which means `lib/auth.ts` cannot use `node:crypto`. It uses the global Web Crypto API (`crypto.subtle`) — that's why `tokenFor` / `verifyToken` are async. The cookie value is `HMAC-SHA256(APP_PASSWORD, APP_PASSWORD)`, so rotating `APP_PASSWORD` invalidates every existing session.

`/api/login` and `/api/logout` are exempt from the middleware via the `matcher` config; everything else (pages and API routes) redirects to `/login` (or returns 401 for `/api/*`) when the cookie is missing or invalid.

### Progression rule

`lib/progression.ts#suggestNextWeight` is only called for the three main lifts (`MAIN_LIFT_IDS` in `lib/plan.ts`: back-squat, romanian-deadlift, trap-bar-deadlift). It walks back through prior weeks for the same day, finds the most recent logged session, and applies the program rule: if every working set hit target reps AND avg RPE ≤ phase target, suggest `prevTopWeight + 2.5 kg`; otherwise suggest a repeat. The result renders as the `Try X kg` chip in `SessionScreen.tsx`.

### Phase targets live in two places

`PHASES` in `lib/plan.ts` defines the display labels and main scheme strings ("3×8 @ RPE 6-7" etc.), while `TARGET_REPS_BY_PHASE` and `RPE_TARGET_BY_PHASE` in `lib/progression.ts` define the numeric thresholds the suggester uses. If you change one, update the other.

### Duplicated exercises across days

Two movements appear in two `DAYS` entries with different ids:

- Standing calf raise: `standing-calf-raise` (Day 1) + `standing-calf-raise-d4` (Day 4)
- Tibialis raise: `tibialis-raise-d2` (Day 2) + `tibialis-raise-d4` (Day 4)

When updating shared metadata (e.g. `videoUrl`), update **both** entries. They're kept as separate ids because the set/rep target differs by day.

## Storage abstraction

`lib/kv.ts` uses `@upstash/redis` directly (not the deprecated `@vercel/kv`). It tries `UPSTASH_REDIS_REST_*` first and falls back to `KV_REST_API_*`, so it works whether the project is provisioned via the new Vercel Marketplace Upstash integration or the legacy Vercel KV product.

## Notes from the README

- Vercel deploy flow: import repo → Storage → Marketplace → Upstash Redis → Connect → add `APP_PASSWORD` env var → redeploy.
- For local dev against the production data store, run `vercel env pull .env.local` after the Vercel project is configured.
- `next.config.mjs` pins `outputFileTracingRoot` to the project directory because there's a parent `package-lock.json` higher in the filesystem that Next.js would otherwise pick as workspace root.
