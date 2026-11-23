import { bindings, defineConfig } from "cf/config"

import { getD1Main, getModeVars, workerName } from "./packages/config/cloudflare-identity.ts"

/**
 * `production` is Vite's default build mode. `bun run build` is
 * `vite build --mode ${CLOUDFLARE_ENV:-production}`; `cf deploy --prebuilt`
 * must pass that same `--mode`. `cf build --mode` is rejected for TanStack
 * Start in cf 1.0.0-rc.2 (framework is not marked as supporting `--mode`).
 *
 * D1 `migrations_dir` is not a binding field in `cloudflare.config.ts`.
 * Apply migrations with `bun run db:migrate` (`--dir` is set there).
 *
 * Static assets come from the Vite / TanStack Start client build. The
 * previous Wrangler `assets.directory` (`./dist/client`) is not copied
 * here; `htmlHandling` is the runtime equivalent.
 */
function worker(mode?: string) {
  const vars = getModeVars(mode)
  const database = getD1Main(mode)

  return {
    name: workerName,
    compatibilityDate: "2026-08-30",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "@tanstack/react-start/server-entry",
    previewUrls: true,
    observability: {
      enabled: true,
    },
    assets: {
      htmlHandling: "drop-trailing-slash" as const,
    },
    env: {
      CLOUDFLARE_TURNSTILE_PUBLIC_KEY: bindings.text(vars.CLOUDFLARE_TURNSTILE_PUBLIC_KEY),
      NEWSLETTER_SEGMENT_ID: bindings.text(vars.NEWSLETTER_SEGMENT_ID),
      BETTER_AUTH_SECRET: bindings.secret(),
      OTP_SECRET: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      POLAR_ACCESS_TOKEN: bindings.secret(),
      POLAR_WEBHOOK_SECRET: bindings.secret(),
      CLOUDFLARE_TURNSTILE_SECRET_KEY: bindings.secret(),
      DB_MAIN: bindings.d1({
        name: database.name,
        ...(database.id ? { id: database.id } : {}),
      }),
      ASSETS: bindings.assets(),
    },
  }
}

export default defineConfig(({ mode }) => {
  switch (mode) {
    case "production":
    case "preview":
    case "test":
      return { worker: worker(mode) }
    default:
      return { worker: worker("development") }
  }
})
