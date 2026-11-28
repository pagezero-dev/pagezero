import type { CoreConfig } from "@/core"
import type { EmailConfig } from "@/email"
import type { PaymentsConfig } from "@/payments"

import development from "./development.ts"
import e2e from "./e2e.ts"
import preview from "./preview.ts"
import production from "./production.ts"

export type Config = CoreConfig & EmailConfig & PaymentsConfig

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
  return import.meta.env?.MODE
}

const config: Config = getConfig(detectMode())

export default config
