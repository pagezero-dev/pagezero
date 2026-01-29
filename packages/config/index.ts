import type { CoreConfig } from "@/core"

export const userRoles = ["premium", "elite"] as const

export type Config = CoreConfig

const config: Config = {
  core: {
    supportEmail: "support@pagezero.dev",
    websiteUrl: "https://www.pagezero.dev",
    projectName: "PageZERO",
    darkMode: true,
    appTitle:
      "PageZERO - A Cloudflare-based web stack designed for AI-assisted app development.",
  },
}

export default config
