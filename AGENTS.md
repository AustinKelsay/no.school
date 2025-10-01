# Repository Guidelines

## Project Structure & Module Organization
- App Router screens and API handlers live in `src/app`; shared UI, contexts, hooks, lib utilities, types, and seed data stay in `src/components`, `src/contexts`, `src/hooks`, `src/lib`, `src/types`, and `src/data`.
- Database artifacts (schema, migrations, seed) live in `prisma/`; rerun Prisma generation after edits.
- Repo docs and protocol notes reside in `docs/`; update them whenever behavior, APIs, or relays change.
- Static assets belong in `public/`, while operational scripts remain in `scripts/`.

## Build, Test, and Development Commands
- `npm run dev` starts Next.js 15 with Turbopack; run Postgres locally or with `docker compose up db`.
- `npm run build` (prisma generate + compile) and `npm run start` prepare and serve the production bundle.
- `npm run lint` enforces the flat Next.js ESLint profile; resolve all warnings before review.
- `npm run db:push` syncs schema changes; pair with `npm run db:seed` to refresh fixtures.
- `docker compose up app` launches the full stack and waits for Prisma sync automatically.

## Coding Style & Naming Conventions
- Favor TypeScript, 2-space indentation, double quotes, and Prettier defaults.
- Components, contexts, and hooks use PascalCase or `usePrefix` filenames; route folders stay kebab-case.
- Prefer `@/` path aliases and trim unused imports even though ESLint suppresses the rule.

## Testing Guidelines
- No `npm test` script exists yet; document manual smoke checks in each PR and add targeted automation when introducing critical flows.
- Store future tests as `*.test.ts[x]` adjacent to the module, faking external calls with fixtures from `src/data`.
- Always verify auth, content fetches, and Lightning flows locally, especially after Prisma or env updates.

## Commit & Pull Request Guidelines
- Keep commit subjects short, imperative, and lower-case (e.g., `cleaning up`); collapse fixups before pushing.
- Reference issues, flag schema or env changes in the body, and align docs in `docs/` when needed.
- PRs need a concise summary, UI evidence for visual tweaks, and the manual checks you executed.

## Environment & Configuration
- Copy `.env.example` to `.env` (Docker) or `.env.local` and supply `DATABASE_URL`, `POSTGRES_*`, and `NEXTAUTH_SECRET`.
- Use `wait-for-db.sh` in scripts so Prisma runs only after Postgres is ready.
