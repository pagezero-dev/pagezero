---
name: RR7 to TanStack Start
overview: Migrate the PageZERO starter from React Router v7 (framework mode on Cloudflare Workers) to TanStack Start, keeping Cloudflare Workers + D1, using TanStack Router virtual file routes (preserving the apps/routes.ts approach), and converting loaders/actions/SWR endpoints to idiomatic server functions and route loaders.
todos:
  - id: deps-config
    content: "Swap dependencies and build config: remove react-router/@react-router/dev/swr, add @tanstack/react-start, @tanstack/react-router, @tanstack/virtual-file-routes, @tanstack/react-query, @vitejs/plugin-react; update vite.config.ts (cloudflare before tanstackStart), wrangler.json (main + compat date), package.json scripts, tsconfig.json; delete react-router.config.ts and workers/index.ts."
    status: pending
  - id: routes-config
    content: Rewrite apps/routes.ts using @tanstack/virtual-file-routes (rootRoute/layout/index/route) and wire virtualRouteConfig + routesDirectory + generatedRouteTree into the tanstackStart plugin.
    status: pending
  - id: server-primitives
    content: Create getDb() (env from cloudflare:workers) and useAppSession/updateAppSession/clearAppSession; delete RR context/middleware files (auth/context.ts, auth/middleware.server.ts, core/context.ts, packages/db/context.ts, packages/types/router.ts); update auth.server.ts requireUserId.
    status: pending
  - id: root-shell
    content: Convert apps/root.tsx to a TanStack createRootRoute (HeadContent/Scripts, head meta/links, errorComponent); add apps/router.tsx wired with a QueryClient (QueryClientProvider); remove/replace entry.client.tsx and entry.server.tsx. No user data loaded server-side so HTML stays cacheable.
    status: pending
  - id: user-data
    content: "Replace /user SWR with client-side TanStack Query: add getUser createServerFn (callable from client), reimplement useUser() as useQuery({ queryKey: ['user'], queryFn: getUser }) so user data loads on the client (HTML cacheable); invalidate the user query after login/logout; update content/layout.tsx and checkout-button.tsx consumers."
    status: pending
  - id: auth-routes
    content: Convert login (loader + multi-step OTP action -> createServerFn + component state) and logout (createServerFn clearing session) to TanStack Start.
    status: pending
  - id: api-routes
    content: Convert payments/webhook and email/sent to TanStack server routes; update payments/handlers.server.ts to take db/env directly instead of RouterContextProvider.
    status: pending
  - id: page-links
    content: Update remaining pages (home, privacy, terms, payments/success, content layout) to @tanstack/react-router imports; convert dead Links (/docs, /features, /getting-started, /contact) to <a>.
    status: pending
  - id: tests
    content: Rewrite webhook.test.ts for new handler signature; fix DOM tests using useUser; verify e2e auth flow + /emails/sent against new login UI.
    status: pending
  - id: validate
    content: Run check, check:types, unit tests, then `bun run dev` smoke + build + e2e to confirm parity.
    status: pending
isProject: false
---

## Goal

Replace React Router v7 framework mode with TanStack Start while:

- Keeping Cloudflare Workers + D1 (Drizzle) as the runtime/deployment target.
- Driving routing from a virtual file route config (`apps/routes.ts`) via `@tanstack/virtual-file-routes`, mirroring today's structure.
- Converting loaders/actions into idiomatic `createServerFn` + route loaders, and the SWR `/user` fetch into a client-side TanStack Query backed by a `getUser` server function (so HTML stays cacheable).

## Architecture mapping (RR v7 -> TanStack Start)

```mermaid
flowchart LR
  subgraph rr [React Router v7]
    rrEntry["workers/index.ts\nRouterContextProvider"]
    rrCtx["dbContext / envContext / authContext"]
    rrRoutes["apps/routes.ts\n@react-router/dev/routes"]
    rrLoader["loader/action\ncontext.get(...)"]
    rrSwr["useUser -> SWR fetch /user"]
  end
  subgraph ts [TanStack Start]
    tsEntry["@tanstack/react-start/server-entry\n(wrangler main)"]
    tsEnv["cloudflare:workers env\n+ getDb() / useAppSession()"]
    tsRoutes["apps/routes.ts\n@tanstack/virtual-file-routes"]
    tsFn["createServerFn / beforeLoad / loader"]
    tsUser["useUser -> useQuery + getUser serverFn\n(client-side fetch)"]
  end
  rrEntry --> tsEntry
  rrCtx --> tsEnv
  rrRoutes --> tsRoutes
  rrLoader --> tsFn
  rrSwr --> tsUser
```



Key replacements:

- `RouterContextProvider` + `dbContext`/`envContext` -> access `env` from `cloudflare:workers`; a `getDb()` helper builds `drizzle(env.DB, { schema })` on the server.
- `authContext` + `createCookieSessionStorage` -> `useSession` from `@tanstack/react-start/server` wrapped in `useAppSession()/updateAppSession()/clearAppSession()` helpers (uses existing `SESSION_COOKIE_SECRET`, must be 32+ chars).
- RR `loader`/`action` -> `createServerFn`; route protection -> `beforeLoad`.
- SWR `useUser` + `/user` JSON route -> `getUser` `createServerFn` (an RPC endpoint callable from the client) consumed by `useUser()` = `useQuery({ queryKey: ["user"], queryFn: getUser })`. User data is fetched on the client after hydration, so page HTML carries no user-specific data and remains cacheable. The dedicated `/user` route is removed (the server fn replaces it).
- `webhook` and `emails/sent` stay as API/server routes (no UI) implemented with TanStack server route handlers.

## Decisions (defaults taken)

- User data fetched client-side via `@tanstack/react-query` + a `getUser` server function. Deliberately NOT loaded in a route loader/SSR so page HTML stays cacheable and user-specific data hydrates on the client (matches the current SWR behavior, just idiomatic). A shared `QueryClient` is provided at the root.
- Dead `Link`s to nonexistent routes (`/docs`, `/features`, `/getting-started`, `/contact`) -> convert to plain `<a>` to satisfy typed routing.
- Keep `apps` as the source/routes directory to minimize file moves.

## Routing config (`apps/routes.ts`)

Rewrite using `@tanstack/virtual-file-routes` (paths relative to routes dir `apps`):

```ts
import { rootRoute, route, index, layout } from "@tanstack/virtual-file-routes"

export const routes = rootRoute("root.tsx", [
  layout("content-layout", "content/routes/layout.tsx", [
    index("content/routes/home.tsx"),
    route("/privacy", "content/routes/privacy.tsx"),
    route("/terms-and-conditions", "content/routes/terms-and-conditions.tsx"),
  ]),
  route("/login", "auth/routes/login.tsx"),
  route("/logout", "auth/routes/logout.tsx"),
  route("/payments/success", "payments/routes/success.tsx"),
  route("/payments/webhook", "payments/routes/webhook.ts"),
  route("/emails/sent", "email/routes/sent.ts"),
])
```

Wire it through `tanstackStart()` (virtualRouteConfig + routesDirectory `apps`, generatedRouteTree e.g. `apps/routeTree.gen.ts`).

## Config / tooling changes

- [vite.config.ts](vite.config.ts): replace `reactRouter()` with `tanstackStart({...})` + `@vitejs/plugin-react`; keep `cloudflare({ viteEnvironment: { name: "ssr" } })` placed BEFORE `tanstackStart()`, plus `tailwindcss()` and `tsconfigPaths()`. Keep the VITEST/storybook guards.
- [wrangler.json](wrangler.json): set `"main": "@tanstack/react-start/server-entry"`, bump `compatibility_date`, keep `nodejs_compat`, keep D1 bindings/envs; adjust `assets` per cloudflare vite plugin output.
- Delete [react-router.config.ts](react-router.config.ts) and [workers/index.ts](workers/index.ts).
- [package.json](package.json): remove `react-router`, `@react-router/dev`, `swr`; add `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/virtual-file-routes`, `@vitejs/plugin-react` (+ optional `@tanstack/react-router-devtools`). Update scripts: `dev`/`build`/`preview`/`deploy` and drop `react-router typegen` from `check:types`/`setup` (route tree is generated by the plugin).
- [tsconfig.json](tsconfig.json): drop `.react-router/types` from include/rootDirs; ensure `apps/routeTree.gen.ts` is included; keep `@/*` paths.

## Core app shell

- `apps/root.tsx` -> TanStack root route (`createRootRoute`): move `<html>`/`<head>` shell into root component using `HeadContent` + `Scripts`; move meta/links into `head: () => ({ meta, links })`; `ErrorBoundary` -> `errorComponent` (reuse `ErrorPage`); wrap the app in `QueryClientProvider`. No user/session loading server-side (keeps HTML cacheable). Remove `authMiddleware` root middleware.
- Create `apps/router.tsx` (`createRouter` + register types): instantiate a shared `QueryClient` and integrate it with the router (e.g. `routerWithQueryClient` / context), so `useUser`'s `useQuery` works everywhere. Remove/replace [apps/entry.client.tsx](apps/entry.client.tsx) and [apps/entry.server.tsx](apps/entry.server.tsx) (Start provides the server entry; add a client entry only if needed for custom hydration).

## Server primitives

- New `apps/core/db.server.ts` (or similar): `getDb()` using `env` from `cloudflare:workers`.
- Rework [apps/auth/session.server.ts](apps/auth/session.server.ts): `useAppSession()/updateAppSession()/clearAppSession()` via `useSession`, with explicit `cookie.secure` set from env to avoid the known Safari/dev cookie issue.
- Delete [apps/auth/context.ts](apps/auth/context.ts), [apps/auth/middleware.server.ts](apps/auth/middleware.server.ts), [apps/core/context.ts](apps/core/context.ts), [packages/db/context.ts](packages/db/context.ts), and [packages/types/router.ts](packages/types/router.ts) (RR context types).
- Update [apps/auth/auth.server.ts](apps/auth/auth.server.ts) `requireUserId` to read the session directly and `throw redirect(...)` from `@tanstack/react-router`.

## Route conversions

- `login` ([apps/auth/routes/login.tsx](apps/auth/routes/login.tsx)): loader (`redirect` if already logged in) + the multi-step OTP `action` -> `createServerFn({ method: "POST" })`; replace RR `<Form>`/`useNavigation`/`actionData` with a server-fn mutation driving local component state.
- `logout` ([apps/auth/routes/logout.tsx](apps/auth/routes/logout.tsx)): action -> `createServerFn` that clears session and redirects.
- `user` ([apps/user/routes/user.tsx](apps/user/routes/user.tsx)) + [apps/user/use-user.ts](apps/user/use-user.ts): remove the dedicated route; add a `getUser` `createServerFn` (reads session via `useAppSession`, looks up the user). Reimplement `useUser()` as `useQuery({ queryKey: ["user"], queryFn: () => getUser() })` (client-side fetch, preserves SWR-like ergonomics). After login/logout, call `queryClient.invalidateQueries({ queryKey: ["user"] })`. Consumers [apps/content/routes/layout.tsx](apps/content/routes/layout.tsx) and [apps/payments/components/checkout-button/checkout-button.tsx](apps/payments/components/checkout-button/checkout-button.tsx) keep using `useUser()` with minimal change.
- `payments/webhook` ([apps/payments/routes/webhook.tsx](apps/payments/routes/webhook.tsx)) + [apps/payments/handlers.server.ts](apps/payments/handlers.server.ts): convert to a TanStack server route POST handler; handlers take `db`/`env` directly instead of `context`.
- `payments/success` ([apps/payments/routes/success.tsx](apps/payments/routes/success.tsx)): static page; swap `react-router` `Link` for `@tanstack/react-router` `Link`.
- `emails/sent` ([apps/email/routes/sent.ts](apps/email/routes/sent.ts)): convert to a server route GET; gate on PROD.
- Content pages (home/privacy/terms): swap `react-router` imports for `@tanstack/react-router`; convert dead `Link`s to `<a>`.

## Tests

- Rewrite [apps/payments/routes/webhook.test.ts](apps/payments/routes/webhook.test.ts): drop `RouterContextProvider`/`context.get` shape; call the new webhook handler / handlers with injected `db`/`env`.
- Audit DOM tests that render components using `useUser` (e.g. header): wrap with a `QueryClientProvider` (and mock `getUser`) since the hook now uses `useQuery`.
- e2e: [e2e/auth.spec.ts](e2e/auth.spec.ts) still fetches `/emails/sent` (kept). Verify selectors/flow against the rewritten login UI; confirm `playwright.config.ts` `vite preview`/`dev` commands still serve on :3000.

## Risks / watch items

- Cloudflare D1 binding access pattern (`cloudflare:workers` env) and Start's Cloudflare build output (assets dir, wrangler `main`) must line up; validate with `bun run dev` and a `build`.
- Login UX is the most involved conversion (multi-step OTP state previously carried by RR `actionData`).
- Typed routing will flag links to nonexistent routes; handled by converting them to `<a>`.
- `useSession` cookie `secure` flag in dev (known issue) — set explicitly.

## Validation

Run `bun run check`, `bun run check:types`, `bun run test`, then `bun run dev` smoke + `bun run test:e2e`.

Docs: TanStack Start Cloudflare hosting ([https://tanstack.com/start/latest/docs/framework/react/guide/hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)), Virtual File Routes ([https://tanstack.com/router/latest/docs/routing/virtual-file-routes](https://tanstack.com/router/latest/docs/routing/virtual-file-routes)), Authentication/sessions ([https://tanstack.com/start/latest/docs/framework/react/guide/authentication](https://tanstack.com/start/latest/docs/framework/react/guide/authentication)).