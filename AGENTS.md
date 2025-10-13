# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router, API routes, and layout logic live in `src/app`. Shared building blocks stay alongside their domain: UI in `src/components`, contexts in `src/contexts`, reusable hooks in `src/hooks`, utilities in `src/lib`, types in `src/types`, and deterministic fixtures in `src/data`. Database schema, migrations, and seeds are under `prisma/`. Documentation updates belong in `docs/`, static assets in `public/`, and operational scripts in `scripts/`.

## Build, Test, and Development Commands
- `npm run dev` boots Next.js 15 with Turbopack; make sure Postgres is running locally or via `docker compose up db`.
- `npm run build` runs Prisma generate and produces the production bundle; follow with `npm run start` to serve it.
- `npm run lint` enforces the flat Next.js ESLint rules—resolve warnings before review.
- `npm run db:push` applies schema changes to your database, and `npm run db:seed` refreshes fixtures.
- `docker compose up app` orchestrates the stack and waits for Prisma to finish syncing.

## Coding Style & Naming Conventions
Write TypeScript with 2-space indentation, double quotes, and Prettier defaults. Components, contexts, and hooks use PascalCase (hooks prefixed with `use`), while route directories stay kebab-case. Prefer the `@/` alias over relative traversals, and delete unused imports even if linting permits them.

## Testing Guidelines
We do not have an automated test script yet, so document manual smoke checks in every PR. Future unit and integration tests should sit beside the module as `*.test.ts[x]`, stubbing external calls with fixtures from `src/data`. Always recheck authentication, content loading, and Lightning flows after Prisma or environment updates.

## Commit & Pull Request Guidelines
Keep commit subjects short, imperative, and lower-case (for example `clean up`, `add feature`, or `fix bug`), and squash fixups before pushing. Reference related issues, call out schema or environment changes in the body, and update `docs/` when behavior or APIs shift. PRs need a concise summary, linked evidence for UI tweaks, and the list of manual checks you executed.

## Environment & Configuration
Copy `.env.example` to `.env` for Docker or `.env.local` for direct runs, then set `DATABASE_URL`, the `POSTGRES_*` credentials, and `NEXTAUTH_SECRET`. Use `wait-for-db.sh` or the compose flow so Prisma migrations only run after Postgres is ready.
