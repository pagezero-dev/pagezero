import { bindings, defineConfig } from "cf/config"

import { getConfig } from "./packages/config/index.ts"

/**
 * `production` is Vite's default build mode. Pass `--mode` to
 * `bun run build` (`vite build --mode`) and the same `--mode` to
 * `bun run deploy` (`cf deploy --prebuilt`). `cf build --mode` is
 * rejected for TanStack Start in cf 1.0.0-rc.2 (framework is not
 * marked as supporting `--mode`).
 *
 * D1 `migrations_dir` is not a binding field in `cloudflare.config.ts`.
 * Apply migrations with `bun run db:migrate` (`--dir` is set there).
 *
 * Static assets come from the Vite / TanStack Start client build. The
 * previous Wrangler `assets.directory` (`./dist/client`) is not copied
 * here; `htmlHandling` is the runtime equivalent.
 */
function d1Binding(database: { name: string; id?: string }) {
  return bindings.d1({
    name: database.name,
    ...(database.id ? { id: database.id } : {}),
  })
}

function worker(mode?: string) {
  const { cloudflare } = getConfig(mode)
  const dbMain = cloudflare.d1.find((database) => database.binding === "DB_MAIN")
  if (!dbMain) {
    throw new Error("Cloudflare config must include a DB_MAIN D1 database.")
  }

  return {
    name: cloudflare.workerName,
    compatibilityDate: cloudflare.compatibilityDate,
    compatibilityFlags: cloudflare.compatibilityFlags,
    entrypoint: "@tanstack/react-start/server-entry",
    previewUrls: true,
    observability: {
      enabled: true,
    },
    assets: {
      htmlHandling: "drop-trailing-slash" as const,
    },
    env: {
      CLOUDFLARE_TURNSTILE_PUBLIC_KEY: bindings.text(
        cloudflare.vars.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
      ),
      NEWSLETTER_SEGMENT_ID: bindings.text(cloudflare.vars.NEWSLETTER_SEGMENT_ID),
      BETTER_AUTH_SECRET: bindings.secret(),
      OTP_SECRET: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      POLAR_ACCESS_TOKEN: bindings.secret(),
      POLAR_WEBHOOK_SECRET: bindings.secret(),
      CLOUDFLARE_TURNSTILE_SECRET_KEY: bindings.secret(),
      ...Object.fromEntries(
        cloudflare.d1
          .filter((database) => database.binding !== "DB_MAIN")
          .map((database) => [database.binding, d1Binding(database)]),
      ),
      DB_MAIN: d1Binding(dbMain),
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
