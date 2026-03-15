# AGENTS.md

## Cursor Cloud specific instructions

**PageZERO** is a full-stack TypeScript web app built for Cloudflare (React Router v7 + Vite + Cloudflare Workers + D1 SQLite). See `README.md` for full stack details and scripts.

### Runtime requirements

- **Node.js >= 24.11.0** and **Bun >= 1.3.1** (pinned versions in `.tool-versions`: Node 24.13.0, Bun 1.3.8).
- The lockfile is `bun.lock` — always use `bun` as the package manager.

### Key commands (all via `bun run`)

| Task | Command |
|---|---|
| Install + full setup | `bun run setup` |
| Dev server (port 3000) | `bun run dev` |
| Lint & format (Biome) | `bun run check` |
| Lint & format fix | `bun run check:fix` |
| Type check | `bun run check:types` |
| Unit tests (Vitest) | `bun run test` |
| E2E tests (Playwright) | `bun run test:e2e` |
| Storybook (port 6006) | `bun run storybook` |
| Full sanity check | `bun run doctor` |

### Non-obvious caveats

- `bun run check:types` runs `wrangler types && react-router typegen && tsc` — the `wrangler types` step generates `worker-configuration.d.ts` which must exist before `tsc` will pass. If type checks fail after dependency changes, re-run `wrangler types` first.
- `bun run test` first runs `bun run db:export` (exports schema to `packages/db/schema.sql`) before running Vitest. The local D1 database must exist; if missing, run `bun run db:setup`.
- The dev server uses `@cloudflare/vite-plugin` to emulate Workers locally — no Cloudflare account is needed for local development.
- The local database is file-based SQLite at `.wrangler/state/v3/d1/`. If it gets corrupted, `bun run db:setup` recreates it from scratch.
- Playwright needs Chromium installed: `playwright install --with-deps chromium` (already run by `bun run setup`).
