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

export function detectMode() {
  const viteMode = import.meta.env?.MODE
  if (typeof viteMode === "string" && viteMode.length > 0) {
    return viteMode
  }

  const index = process.argv.indexOf("--mode")
  if (index === -1) {
    return undefined
  }
  const value = process.argv[index + 1]
  if (value === undefined || value.startsWith("-")) {
    return undefined
  }
  return value
}

const config: Config = getConfig(detectMode())

export default config
