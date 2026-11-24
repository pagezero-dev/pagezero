import type { CloudflareConfig } from "@/cloudflare"
import type { CoreConfig } from "@/core"
import type { EmailConfig } from "@/email"
import type { PaymentsConfig } from "@/payments"

import development from "./development.ts"
import e2e from "./e2e.ts"
import preview from "./preview.ts"
import production from "./production.ts"

export type Config = CoreConfig & EmailConfig & PaymentsConfig & CloudflareConfig

export type ConfigMode = "production" | "preview" | "development" | "e2e"

export function getConfig(mode?: string): Config {
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

function detectMode() {
  const viteMode = import.meta.env?.MODE
  if (typeof viteMode === "string" && viteMode.length > 0) {
    return viteMode
  }
  return process.env.CLOUDFLARE_ENV
}

const config: Config = getConfig(detectMode())

export default config
