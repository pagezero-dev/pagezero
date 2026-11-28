import { bindings, defineConfig } from "cf/config"

import { getCloudflareConfig } from "./packages/config/cloudflare/index.ts"

/**
 * Import `packages/config/cloudflare`, not `packages/config`. The
 * Cloudflare Vite plugin adds every file imported here to
 * `server.fs.deny`, and the Worker loads `@/config` during `vite dev`.
 */
function worker(mode?: string) {
  const cloudflare = getCloudflareConfig(mode)
  const dbMain = cloudflare.d1.find((database) => database.binding === "DB_MAIN")
  if (!dbMain) {
    throw new Error("Cloudflare config must include a DB_MAIN D1 database.")
  }

  return {
    name: cloudflare.workerName,
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
          .map((database) => [
            database.binding,
            bindings.d1({ name: database.name, id: database.id }),
          ]),
      ),
      DB_MAIN: bindings.d1({ name: dbMain.name, id: dbMain.id }),
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
