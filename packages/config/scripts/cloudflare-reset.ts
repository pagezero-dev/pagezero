import { basename } from "node:path"

import { write } from "bun"

const projectName = basename(process.cwd())

console.log(`🔄 Resetting Cloudflare identity for "${projectName}"...`)

const source = `export const workerName = ${JSON.stringify(projectName)}

export const d1MigrationsDir = "./packages/db/main/migrations"

export interface D1DatabaseRef {
  name: string
  id?: string
}

export const d1Main: Record<"development" | "production" | "preview", D1DatabaseRef> = {
  development: { name: ${JSON.stringify(`${projectName}-development`)}, id: "00000000-0000-4000-8000-000000000000" },
  production: {
    name: ${JSON.stringify(`${projectName}-production`)},
  },
  preview: {
    name: ${JSON.stringify(`${projectName}-preview`)},
  },
}

export const modeVars = {
  development: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "1x00000000000000000000BB",
    NEWSLETTER_SEGMENT_ID: "",
  },
  production: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
  preview: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
  test: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

export type CloudflareMode = "development" | "production" | "preview" | "test"

export function getD1Main(mode?: string) {
  if (mode === "production") {
    return d1Main.production
  }
  if (mode === "preview") {
    return d1Main.preview
  }
  return d1Main.development
}

export function getModeVars(mode?: string) {
  if (mode === "production") {
    return modeVars.production
  }
  if (mode === "preview") {
    return modeVars.preview
  }
  if (mode === "test") {
    return modeVars.test
  }
  return modeVars.development
}
`

await write("./packages/config/cloudflare-identity.ts", source)

console.log(`✅ Finished resetting Cloudflare identity for "${projectName}".`)
