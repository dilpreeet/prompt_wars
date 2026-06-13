# PlatePlanner

A personal cooking to-do micro app built with Next.js. Enter your day (people, budget, diet, time, meals) and get:

- A meal plan (breakfast / lunch / dinner)
- A merged grocery list
- Budget feasibility check
- Smart substitutions (diet + cost)
- Optional AI tips via Google Gemini

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Vitest + Testing Library (engine unit tests)
- Zod (input validation)
- localStorage (persistence, no database)
- Google Gemini API (optional `/api/enhance`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional AI enhancement

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`
3. Restart the dev server — the **Enhance with AI** panel activates automatically

The app works fully without an API key.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | ESLint |

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add `GEMINI_API_KEY` as an environment variable (optional)
4. Deploy — you'll get a public `*.vercel.app` URL

### Vercel settings (important)

In **Project → Settings → Build & Deployment**, use:

| Setting | Value |
|---------|-------|
| Framework Preset | **Next.js** |
| Root Directory | *(leave empty — repo root)* |
| Build Command | `npm run build` |
| Output Directory | *(leave empty — do NOT set `.next` or `out`)* |
| Production Branch | `main` |

If you see a plain **404: NOT_FOUND** page (not the Next.js styled 404), the Output Directory is almost always wrong — clear it and **Redeploy**.

Or use the CLI:

```bash
npx vercel --prod
```

## Project structure

```
src/
  app/           # Next.js pages + API routes
  components/    # UI (PlannerForm, GroceryList, etc.)
  lib/           # Engine, recipes, validation, tests
```

## Security

- API keys are server-only (`process.env`, never `NEXT_PUBLIC_`)
- Zod validation on all inputs
- Security headers via `next.config.ts`
- Rate limiting + payload guards on `/api/enhance`
