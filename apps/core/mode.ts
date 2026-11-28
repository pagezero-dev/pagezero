export type AppMode = "production" | "preview" | "development" | "e2e"

/**
 * App deploy target from Vite `--mode` (set via `CLOUDFLARE_ENV` at build time).
 * Prefer this over `import.meta.env.PROD` — Vite sets PROD for every production
 * build, including Cloudflare preview/e2e deploys.
 */
export function getAppMode(): AppMode {
  const mode = import.meta.env.MODE
  if (mode === "production" || mode === "preview" || mode === "development" || mode === "e2e") {
    return mode
  }
  return "development"
}
