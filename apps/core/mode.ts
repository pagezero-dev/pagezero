/**
 * App deploy target from Vite `--mode` (set via `CLOUDFLARE_ENV` at build time).
 * Prefer this over `import.meta.env.PROD` — Vite sets PROD for every production
 * build, including Cloudflare preview/test deploys.
 */
export function getAppMode(): "production" | "preview" {
  return import.meta.env.MODE === "production" ? "production" : "preview"
}
