# Team Task Board

Minimal local-only Turborepo skeleton for a Kanban web application.

## Workspace Layout
- `apps/web` – frontend Next.js or other web client placeholder.
- `apps/api` – backend service placeholder.
- `packages/database` – shared database/client utilities.
- `packages/config` – reusable tooling configurations (`typescript`, `eslint`).

## Tooling
- Package manager: pnpm workspaces
- Task runner: Turborepo (`pipeline` configs for build/dev/lint)
- Formatting: Prettier (`pnpm format`)

## Useful Scripts
- `pnpm dev` – run dev tasks across packages via Turbo.
- `pnpm build` – build all packages respecting dependency graph.
- `pnpm lint` – lint all workspaces with shared ESLint config.
- `pnpm format` – format the entire repo with Prettier.

Clone and start adding packages and applications as the Kanban app evolves.
