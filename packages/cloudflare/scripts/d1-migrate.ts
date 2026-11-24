import { spawnSync } from "bun"

import { getConfig } from "@/config"

/**
 * `cf migrate` drops Wrangler `migrations_dir` / `migrations_table`.
 * `cf d1 migrations apply` takes a database ID (not a binding name) and
 * defaults to the remote database — local scripts must pass `--local`.
 */
const local = process.argv.includes("--local")
const mode = process.env.CLOUDFLARE_ENV
const { cloudflare } = getConfig(mode)

if (!cloudflare.d1.id) {
  console.error(`D1 database ID is missing for mode "${mode ?? "development"}".`)
  process.exit(1)
}

const args = [
  "d1",
  "migrations",
  "apply",
  cloudflare.d1.id,
  "--dir",
  cloudflare.migrationsDir,
  "--table",
  "d1_migrations",
]
if (local) {
  args.push("--local")
}
if (mode) {
  args.push("--mode", mode)
}

const result = spawnSync(["bunx", "cf", ...args], {
  stdout: "inherit",
  stderr: "inherit",
})

process.exit(result.exitCode ?? 1)
