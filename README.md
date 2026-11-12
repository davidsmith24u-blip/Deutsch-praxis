# DeutschPraxis

German learning platform from A1 to B2 with structured lessons and AI voice interview practice.

## Tech stack

- Next.js 15+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (auth, database, storage)
- Deploy-ready for Vercel

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in Supabase and OpenAI keys.
3. Run Supabase migrations in `supabase/migrations/0001_init.sql`.
4. Start dev server:
   ```bash
   npm run dev
   ```

## Environment variables

See `.env.example`.

## Project structure

- `src/app` — routes (auth, dashboard, curriculum, lessons, interview, progress)
- `src/data/curriculum.ts` — seed lessons and scenarios
- `src/lib/speech.ts` — STT/TTS abstraction (browser default)
- `supabase/migrations` — database schema
