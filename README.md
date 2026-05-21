# Workout plan

A mobile-friendly tracker for a 6-week lower-body, mobility & longevity program
(May 25 – Jul 5, 2026). Logs weight/reps/RPE per set, runs a rest timer,
suggests the next weight based on the program's progression rule, and tracks
mobility/balance markers. Single-user, password-locked, deployed on Vercel.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Upstash Redis (via `@upstash/redis`) — one JSON blob under the key `workout:data`
- HMAC cookie via `middleware.ts` for the password gate

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local: set APP_PASSWORD and, after step 3 in "Deploy" below,
# pull KV credentials via `vercel env pull .env.local`.
npm run dev
```

If you have not connected a KV store yet, set the four `KV_*` vars in
`.env.local` manually after creating an Upstash Redis DB.

Open <http://localhost:3000>, enter the password from `APP_PASSWORD`, and the
dashboard appears.

## Deploy to Vercel

1. Push this repo to GitHub (`josteinskadberg/workoutplan` is already set up).
2. In Vercel, import the repo.
3. **Storage tab → Marketplace → Upstash Redis → Connect** (free tier is
   plenty for personal use). This auto-injects `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` into the project's env vars. (The legacy
   `KV_REST_API_*` names are also accepted as fallback.)
4. **Project settings → Environment variables → add `APP_PASSWORD`** (your
   chosen password, plain string).
5. Redeploy. Open the deployed URL, log in, log a set, refresh, confirm
   persistence.

For local development against the production KV, run `vercel env pull
.env.local`.

## Routes

| Route                        | Purpose                                                  |
|------------------------------|----------------------------------------------------------|
| `/login`                     | Password form                                            |
| `/`                          | Dashboard — current week, day cards, week jump grid      |
| `/workout/[week]/[day]`      | Logging screen (warm-up, exercises, rest timer, notes)   |
| `/progression`               | Main lifts top-set table, Wk1 → Wk6                      |
| `/markers`                   | Mobility/balance markers grid                            |
| `/api/login` (POST/DELETE)   | Login / logout                                           |
| `/api/logout` (POST)         | Logout                                                   |
| `/api/data` (GET/PUT)        | Read/write the entire JSON blob in KV                    |

## Data model

The entire app state lives under one KV key (`workout:data`):

```ts
type WorkoutData = {
  sessions: Record<`w${number}-d${number}`, SessionLog>;
  markers: Record<`wk${number}`, Record<string, string>>;
  baseline: Record<string, string>;
  updatedAt: string;
};
```

The static plan (days, exercises, phases) lives in `lib/plan.ts` and is not
stored in KV — only user-entered data is persisted.

## Progression rule

For main lifts (Back squat, Romanian deadlift, Trap-bar deadlift), the
suggested next weight (chip on the exercise card) follows the program's rule:

- If every working set hit the prescribed reps **and** average RPE ≤ phase
  target → suggest `prevTopWeight + 2.5 kg`
- Otherwise → suggest `prevTopWeight` (repeat)

Phase targets are 8 reps @ RPE 7 (Foundation, Wk 1-2), 6 reps @ RPE 8 (Build,
Wk 3-4), 4-5 reps @ RPE 8 (Peak, Wk 5-6).

## Notes

- Logs are loaded server-side per page render and saved client-side via the
  Save button (the whole blob is PUT — payload stays tiny).
- Rest timer beeps via Web Audio API and vibrates on mobile.
- All numeric inputs use `inputMode="decimal"` / `"numeric"` for the right
  on-screen keypad.
- Add to homescreen for a fullscreen PWA-lite experience.
