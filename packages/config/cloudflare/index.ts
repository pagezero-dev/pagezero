/**
 * Worker settings by Vite/`cf --mode`. `cloudflare.config.ts` imports this
 * subtree only — not `packages/config` — so the Vite plugin's `server.fs.deny`
 * does not block Worker `@/config` during `vite dev`.
 */
import type { CloudflareConfig } from "../../cloudflare/types.ts"
import development from "./development.ts"
import e2e from "./e2e.ts"
import preview from "./preview.ts"
import production from "./production.ts"

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
