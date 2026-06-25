# AGENTS.md

> Guidelines for AI coding agents working in the PageZERO codebase.

## Project Overview

PageZERO is a full-stack TypeScript web application starter built for Cloudflare. It uses TanStack Start, Cloudflare Workers (hosting), and Cloudflare D1 (database).

### Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Start, TanStack Query, TailwindCSS 4, Radix UI
- **Backend**: Cloudflare Workers, Drizzle ORM, D1 SQLite
- **Tooling**: Bun (package manager), Biome (linting/formatting), Vitest (unit tests), Playwright (e2e tests), Storybook (UI development)
- **Email**: React Email, Resend
- **Payments**: Polar.sh integration

## Project Structure

```
├── apps/                    # Feature modules (domain-specific code)
│   ├── auth/               # Authentication (login, logout, session management)
│   ├── brand/              # Marketing pages and brand components
│   ├── core/               # App shell (root, routes, styles)
│   ├── email/              # Email templates and sending logic
│   ├── payments/           # Payment integration (Polar.sh)
│   ├── permissions/        # Role-based permissions system
│   └── user/               # User management
│   ├── root.tsx            # App root route (createRootRoute)
│   ├── router.tsx          # Router factory (createRouter + QueryClient)
│   ├── routes.ts           # Virtual route config (rootRoute, layout, route)
│   └── routeTree.gen.ts    # Auto-generated route tree (do not edit manually)
│
├── packages/               # Shared, reusable code
│   ├── config/            # Application configuration
│   ├── crypto/            # Cryptographic utilities
│   ├── db/                # Database schema, migrations, scripts
│   ├── types/             # Shared TypeScript types
│   ├── ui/                # UI component library (shadcn-style)
│   └── ui-lite/           # Lightweight UI components (no external deps)
│
├── e2e/                    # Playwright end-to-end tests
└── public/                 # Static assets
```

## Path Aliases

Use `@/` prefix for imports which maps to both `./packages/*` and `./apps/*`:

```typescript
import { Button } from "@/ui/button"
import { getUserId } from "@/user"
```

## Coding Conventions

### TypeScript

- Strict mode enabled
- Use `type` keyword for type imports when possible
- Prefer interfaces for object shapes, types for unions/intersections
- Export types alongside implementations

### File Naming

- Components: `kebab-case.tsx` (e.g., `checkout-button.tsx`)
- Tests: `*.test.ts` for node tests, `*.test.tsx` for DOM tests
- Stories: `*.stories.tsx`
- Server-only code: `*.server.ts` (e.g., `auth.server.ts`) — internal helpers, not callable from the client
- RPC endpoints: `rpc/` directory (e.g., `auth/rpc/get-user.ts`) — `createServerFn` exports
- Index files: `index.ts` for public exports

### Component Structure

Each UI component follows this pattern:

```
component-name/
├── index.ts              # Re-exports public API
├── component-name.tsx    # Component implementation
├── component-name.test.tsx
└── component-name.stories.tsx
```

### React Components

- Use function components with explicit props types
- Props type naming: `ComponentNameProps`
- Use `cn()` utility for className merging (from `@/ui/utils`)
- Use `cva` (class-variance-authority) for component variants

```typescript
interface ButtonProps {
  variant?: "default" | "outline"
  size?: "sm" | "lg"
}

function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button, type ButtonProps }
```

### Route Files

Routes use TanStack Router conventions with `createFileRoute`. Callable server logic lives in the feature module's `rpc/` directory as `createServerFn` exports:

```typescript
// apps/user/rpc/get-user.ts
import { createServerFn } from "@tanstack/react-start"
import { getDb } from "@/db"

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb()
  // query db...
  return { user }
})
```

```typescript
// apps/user/routes/profile.tsx
import { createFileRoute } from "@tanstack/react-router"
import { getUser } from "@/user/rpc"

export const Route = createFileRoute("/profile")({
  loader: () => getUser(),
  component: PageComponent,
})

function PageComponent() {
  const { user } = Route.useLoaderData()
  // render...
}
```

- Use `beforeLoad` for auth guards (call a `createServerFn` that throws `redirect` if not authenticated)
- Use `validateSearch` for typed search params
- Access environment variables via `import { env } from "cloudflare:workers"` inside server functions

### Route Registration

Routes are declared in `apps/routes.ts` using `@tanstack/virtual-file-routes` and referenced in `vite.config.ts`. After adding or removing routes, TanStack Router auto-regenerates `apps/routeTree.gen.ts` — do **not** edit that file manually.

```typescript
// apps/routes.ts
import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes"

export const routes = rootRoute("root.tsx", [
  layout("brand-layout", "brand/routes/layout.tsx", [
    index("brand/routes/home.tsx"),
    route("/privacy", "brand/routes/privacy.tsx"),
  ]),
  route("/login", "auth/routes/login.tsx"),
])
```

### Database

- Schema defined in `packages/db/schema.ts` (auto-generated imports)
- Feature schemas in `apps/*/db/schema.ts`
- Access the database via `getDb()` from `@/db` inside server functions:

```typescript
import { getDb } from "@/db"

const getData = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb()
  // use Drizzle ORM...
})
```

- Run `bun run db:generate` after schema changes

### Data Fetching (Client)

Use TanStack Query for client-side data fetching. Server functions (`createServerFn`) are used as query functions:

```typescript
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/user/rpc"

function MyComponent() {
  const { data } = useQuery({
    queryKey: ["my-data"],
    queryFn: () => getUser(),
  })
}
```

### Tests

**Unit Tests (Vitest)**:
- Node tests: `*.test.ts` - run in Node environment
- DOM tests: `*.test.tsx` - run in happy-dom environment
- Use `describe`, `it`, `expect` from vitest
- Use `@testing-library/react` for component tests

```typescript
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("<Component />", () => {
  it("renders", () => {
    render(<Component />)
    expect(screen.getByText("text")).toBeInTheDocument()
  })
})
```

**E2E Tests (Playwright)**:
- Located in `e2e/` directory
- Smoke tests: `*.smoke.spec.ts` - run against deployed environments
- Regular e2e: `*.spec.ts` - run against local dev server

### Storybook

- Stories go alongside components
- Use `Meta` and `StoryObj` types from `@storybook/react-vite`
- Title format: `"Apps/ModuleName/ComponentName"` or `"Packages/UI/ComponentName"`

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Packages/UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: "Button" },
}
```

## Code Quality

### Formatting & Linting

- **Biome** handles both formatting and linting
- Indentation: 2 spaces
- Quotes: double quotes
- Semicolons: as needed (ASI)
- Tailwind classes: sorted automatically via `useSortedClasses` rule

Run checks:
```bash
bun run check        # Check formatting and linting
bun run check:fix    # Auto-fix issues
bun run check:types  # TypeScript type checking
```

## Common Scripts

```bash
bun run dev          # Start development server (localhost:3000)
bun run build        # Production build
bun run preview      # Preview production build locally
bun run test         # Run unit tests
bun run test:watch   # Run tests in watch mode
bun run test:e2e:ui  # Run e2e tests with UI
bun run storybook    # Start Storybook (localhost:6006)
bun run db:studio    # Open Drizzle Studio
bun run db:migrate   # Run database migrations
```

## Adding New Features

### New UI Component

1. Use the `create-component` skill (`.agents/skills/create-component/SKILL.md`) to scaffold
2. Or manually: create folder in `packages/ui/component-name/` and add `component-name.tsx`, `index.ts`, `component-name.test.tsx`, `component-name.stories.tsx`

### New Feature Module

1. Create folder in `apps/feature-name/`
2. Add `index.ts` for public exports
3. Add routes in `routes/` subfolder using `createFileRoute`
4. Add components in `components/` subfolder
5. If database tables needed, add `db/schema.ts`
6. Register routes in `apps/routes.ts`

### New Database Table

1. Add schema in appropriate `apps/*/db/schema.ts`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:migrate` to apply locally

## Environment

- Node.js >= 24
- Bun >= 1.3
- Environment files: `.env` (local), `.env.test` (tests)
- Copy from `.init.env` and `.init.env.test` for initial setup

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Quality check (Biome)
2. Type check (TypeScript)
3. Unit tests (Vitest)
4. E2E tests (Playwright)
5. Database migration
6. Deploy to Cloudflare Workers
7. Smoke tests against deployed URL

- **main branch**: deploys to production
- **PRs**: deploy to preview environment

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/routes.ts` | Virtual route config (add new routes here) |
| `apps/routeTree.gen.ts` | Auto-generated route tree (do not edit) |
| `apps/root.tsx` | App root route and document shell |
| `apps/router.tsx` | Router factory with QueryClient setup |
| `packages/db/schema.ts` | Database schema exports |
| `packages/db/index.ts` | `getDb()` helper for database access |
| `packages/config/index.ts` | App configuration |
| `apps/auth/session.server.ts` | Session helpers (`useAppSession`, `updateAppSession`, `clearAppSession`) |
| `vite.config.ts` | Vite + TanStack Start + Vitest configuration |
| `biome.json` | Linting/formatting rules |
| `drizzle.config.ts` | Database configuration |
| `wrangler.json` | Cloudflare Workers config |
