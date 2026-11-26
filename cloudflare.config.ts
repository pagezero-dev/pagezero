import { bindings, defineConfig } from "cf/config"

import type { CloudflareConfig } from "./packages/cloudflare/types.ts"

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
 *
 * Keep this file from importing `packages/config`. The Cloudflare Vite
 * plugin adds every file imported here to `server.fs.deny`, and the
 * Worker loads `@/config` during `vite dev`.
 */
const workerName = "pagezero"

const production: CloudflareConfig = {
  workerName,
  compatibilityDate: "2026-08-30",
  compatibilityFlags: ["nodejs_compat"],
  d1: [
    {
      binding: "DB_MAIN",
      name: `${workerName}-production`,
      id: "1e6b30f9-afaa-4368-8b76-06ed8d4fe737",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "0x4AAAAAABd1vnMC0VAcAlf3",
    NEWSLETTER_SEGMENT_ID: "f7ba881f-cec0-4c63-94ff-e3d5cc867f21",
  },
}

const preview: CloudflareConfig = {
  ...production,
  d1: [
    {
      binding: "DB_MAIN",
      name: `${workerName}-preview`,
      id: "6eb90f35-05ce-4d9e-bd6d-a4b10ebe8c09",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
}

const development: CloudflareConfig = {
  ...production,
  d1: [
    {
      binding: "DB_MAIN",
      name: `${workerName}-development`,
      // UUID v4 local-only id: `cf d1` rejects Wrangler's `<DATABASE_ID>` placeholder.
      id: "00000000-0000-4000-8000-000000000000",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "1x00000000000000000000BB",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

const e2e: CloudflareConfig = {
  ...development,
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

export function getCloudflareConfig(mode?: string): CloudflareConfig {
  switch (mode) {
    case "production":
      return production
    case "preview":
      return preview
    case "e2e":
      return e2e
    default:
      return development
  }
}

function d1Binding(database: { name: string; id?: string }) {
  return bindings.d1({
    name: database.name,
    ...(database.id ? { id: database.id } : {}),
  })
}

function worker(mode?: string) {
  const cloudflare = getCloudflareConfig(mode)
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
    case "e2e":
      return { worker: worker(mode) }
    default:
      return { worker: worker("development") }
  }
})
