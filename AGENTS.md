# AGENTS.md

Guidelines for AI coding agents working in the PageZERO codebase.

PageZERO is a full-stack TypeScript starter for Cloudflare: TanStack Start, Workers, and D1.

**Frontend**: React 19, TanStack Router / Start / Query, Tailwind CSS 4, Radix UI
**Backend**: Cloudflare Workers, Drizzle ORM, D1, Better Auth (email OTP, Polar.sh)
**Tooling**: Bun, Oxlint, Oxfmt, Vitest, Playwright, Storybook
**Email / payments**: React Email + Resend; Polar.sh via Better Auth

## Layout

```
├── apps/                      # Feature modules
│   ├── auth/                  # Better Auth: OTP, sessions, access control
│   ├── blog/                  # MDX posts and blog routes
│   ├── brand/                 # Marketing pages, legal MDX, brand UI
│   ├── core/                  # App shell, styles, mode
│   ├── email/                 # Templates and sending
│   ├── newsletter/            # Signup and confirm flow
│   ├── payments/              # Polar.sh via Better Auth
│   ├── root.tsx               # Root route (createRootRoute)
│   ├── router.tsx             # Router factory + QueryClient
│   ├── routes.ts              # Virtual route config — add routes here
│   └── routeTree.gen.ts       # Generated — never edit
│
├── packages/                  # Shared code (`@/` maps here first)
│   ├── cloudflare/            # Turnstile, Workers test stub
│   ├── config/                # App configuration
│   ├── crypto/                # Server-side crypto
│   ├── date/                  # Date helpers
│   ├── db/                    # D1 access, generated schema barrel, migrations
│   ├── form/                  # parseFormData, useFormAction
│   ├── mdx/                   # MDX helpers and provider
│   ├── test/                  # mockServerFn for RPC unit tests
│   ├── types/                 # Shared TypeScript utilities
│   ├── ui/                    # shadcn-style components
│   └── ui-lite/               # Lightweight UI (no external deps)
│
├── e2e/                       # Playwright (local `*.spec.ts`, deployed `smoke.spec.ts`)
├── public/                    # Static assets
├── cloudflare.config.ts       # Cloudflare Worker config (`cf --mode`)
└── .agents/skills/            # Agent skills — use these instead of hand-rolling
```

`@/` maps to `./packages/*` then `./apps/*`:

```typescript
import { getUser } from "@/auth/rpc"
import { Button } from "@/ui/button"
```

## Hard rules

- `import type` is required (`verbatimModuleSyntax`). Prefer `interface` for object shapes; export types next to implementations.
- Never import `*.server.ts` from client components, hooks, or route `component` functions. Call `createServerFn` exports from `rpc/` instead.
- Never put `createServerFn` in a route file. It lives in the feature's `rpc/` directory.
- Never edit `apps/routeTree.gen.ts` or `.cloudflare/types` (`bun run generate:types`).
- Register every route in `apps/routes.ts`. After schema changes run `bun run db:generate`.
- Reuse existing auth guards from `@/auth/rpc` (`requireUserId`, `requireGuestUser`, `requireUserPermissions`, `requireUserRole`). Do not invent new redirects.
- Mutations use `@/form` (`parseFormData` in the RPC validator, `useFormAction` on the client). Do not ad-hoc `fetch`.
- Prefer `packages/ui` before adding a new primitive. `env` from `cloudflare:workers` only inside server functions / `*.server.ts`.
- Do not commit `.env` or `.env.e2e`. Copy from `.init.env` / `.init.env.e2e`.

## How we do work

### File naming

- Components: `kebab-case.tsx`. Tests: `*.test.ts` (Node) / `*.test.tsx` (happy-dom). Stories: `*.stories.tsx`.
- Server-only: `*.server.ts`. Client-only: `*.client.ts`. Public API: `index.ts`.

### Components

Use the `component-create` skill. Folder shape:

```
component-name/
├── index.ts
├── component-name.tsx
├── component-name.test.tsx
└── component-name.stories.tsx
```

Function components, `ComponentNameProps`, `cn()` from `@/ui/utils`, `cva` for variants. Story titles: `"Apps/ModuleName/ComponentName"` or `"Packages/UI/ComponentName"`. Theme tokens live in `apps/core/styles/tailwind.css` (`theme-change` skill).

### Routes and RPC

TanStack Router `createFileRoute`. Loaders and actions call `rpc/` server functions. `beforeLoad` for guards. `validateSearch` (Zod) for search params.

```typescript
// apps/auth/rpc/get-user.ts
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "../auth.server"

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  return { user: session?.user ?? null }
})
```

```typescript
// apps/auth/routes/login.tsx — guards already exist
export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: async () => {
    await requireAuthConfiguration()
    await requireGuestUser()
  },
  loader: async ({ deps }) => getLoginPageData({ data: { redirectTo: deps.redirectTo } }),
  component: Login,
})
```

Add or remove paths only in `apps/routes.ts` (see that file for the live tree: `/`, `/legal/$slug`, `/blog`, `/login`, `/newsletter/confirm`, `/payments/success`, …).

### Forms

```typescript
// RPC
.validator((data: FormData) => parseFormData(loginFormSchema, data))

// Client
const { data, error, isPending, onSubmit } = useFormAction(loginFormSchema, loginFormAction)
```

Turnstile: `@/cloudflare/turnstile`.

### Database

Feature tables in `apps/*/db/schema.ts`. `packages/db/main/schema.ts` is the generated barrel (do not hand-edit exports). Access via `getMainDb()` from `@/db/main` inside server code. Drizzle Kit config: `packages/db/drizzle.config.ts` (root `drizzle.config.ts` re-exports it).

```typescript
import { getMainDb } from "@/db/main"

const db = getMainDb()
```

Then `bun run db:generate` and `bun run db:migrate`.

`cf d1 migrations apply` takes a D1 **database ID** (UUID v4, not a binding name or Wrangler `<DATABASE_ID>` placeholder) and **defaults to remote**. `bun run db:migrate` runs `packages/config/scripts/d1-migrate.ts --local`, which reads the ID from `packages/config/cloudflare-identity.ts` and passes `--dir` / `--table` (Wrangler `migrations_dir` is not a `cloudflare.config.ts` field). Local development uses a fixed UUID (`00000000-0000-4000-8000-000000000000`) so persist hashing stays stable. Do not run `cf d1 migrations apply` without `--local` unless you intend to migrate a remote database. CI remote migrate is the deploy workflow `database` job.

### Content (MDX)

Blog posts: `apps/blog/content/*.mdx`. Legal: `apps/brand/content/legal/*.mdx`. Load with `import.meta.glob` plus `@/mdx` (`getMdxFrontmatters`, `getMdxModuleBySlug`). Do not turn articles into React page components.

### Client data

TanStack Query with server functions as `queryFn`. Reuse `useUser` from `@/auth/hooks` for the session.

```typescript
useQuery({ queryKey: ["user"], queryFn: () => getUser() })
```

### Tests

- Vitest: `describe` / `it` / `expect`; Testing Library for DOM. RPC unit tests mock `createServerFn` with `@/test/mock-server-fn`.
- Playwright: `e2e/*.spec.ts` against local; `e2e/smoke.spec.ts` against the deployed URL (`bun run test:smoke`).

### New feature module

1. `apps/feature-name/` with `index.ts`, `routes/`, `components/`, and `db/schema.ts` if needed.
2. Register routes in `apps/routes.ts`.
3. Generate DB migrations if the schema changed.

## Scripts

```bash
bun run check        # oxfmt --check, oxlint, cf workers types, tsc
bun run check:fix    # oxfmt + oxlint --fix (does not run tsc)
bun run test         # unit tests
bun run test:e2e     # local Playwright
bun run test:smoke   # deployed Playwright
bun run db:generate  # after schema changes
bun run db:migrate   # apply D1 migrations locally (`cf d1 migrations apply --local`)
bun run generate:types  # cf workers types → .cloudflare/types/index.d.ts
```

CI is `.github/workflows/deploy.yml` (check → unit → e2e → migrate → deploy → smoke). `main` is production; PRs are preview. `bun run build` is `vite build --mode` (the Vite plugin writes `.cloudflare/output/v1/`). Deploy uses `cf deploy --prebuilt --mode production` on `main` and `cf workers versions create --prebuilt --mode preview` on PRs. Local sign-in is `cf auth login`; CI uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. `cf` loads `cloudflare.config.ts` with Node, not Bun.

## Environment

Node.js >= 24, Bun >= 1.3. Local env: `.env` / `.env.e2e` from `.init.env` / `.init.env.e2e`. App values live in `packages/config/{production,preview,development,e2e}.ts`; `getConfig(mode)` (and the default export via `detectMode()`) selects among them from Vite `import.meta.env.MODE` (`--mode`). Worker config is `cloudflare.config.ts`; D1 names/IDs and mode vars live in `packages/config/cloudflare-identity.ts`. Select a mode with `--mode` (production, preview, e2e) rather than Wrangler `--env`. Vite `--mode test` is reserved by Vitest and TanStack Start. `wrangler.json` is gone; D1 migration paths are CLI flags on `cf d1 migrations apply`, not config fields.
