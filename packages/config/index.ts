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
    case "test":
      return e2e
    default:
      return development
  }
}

function getArgvMode() {
  try {
    const index = process.argv.indexOf("--mode")
    if (index === -1) {
      return undefined
    }
    const value = process.argv[index + 1]
    if (value === undefined || value.startsWith("-")) {
      return undefined
    }
    return value
  } catch {
    // `process.argv` throws in the Workers runtime.
    return undefined
  }
}

function getCloudflareEnv() {
  try {
    const value = process.env.CLOUDFLARE_ENV
    if (typeof value === "string" && value.length > 0) {
      return value
    }
    return undefined
  } catch {
    // `process.env` can throw in the Workers runtime.
    return undefined
  }
}

export function detectMode() {
  const viteMode = import.meta.env?.MODE
  if (typeof viteMode === "string" && viteMode.length > 0) {
    return viteMode
  }
  return getCloudflareEnv() ?? getArgvMode()
}

const config: Config = getConfig(detectMode())

export default config
