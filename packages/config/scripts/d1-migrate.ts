import { spawnSync } from "bun"

import { d1MigrationsDir, getD1Main } from "../cloudflare-identity.ts"

/**
 * `cf migrate` drops Wrangler `migrations_dir` / `migrations_table`.
 * `cf d1 migrations apply` takes a database ID (not a binding name) and
 * defaults to the remote database — local scripts must pass `--local`.
 */
const local = process.argv.includes("--local")
const mode = process.env.CLOUDFLARE_ENV
const database = getD1Main(mode)

if (!database.id) {
  console.error(`D1 database ID is missing for mode "${mode ?? "development"}".`)
  process.exit(1)
}

const args = [
  "d1",
  "migrations",
  "apply",
  database.id,
  "--dir",
  d1MigrationsDir,
  "--table",
  "d1_migrations",
]
if (local) {
  args.push("--local")
}
if (mode) {
  args.push("--mode", mode)
}

const result = spawnSync(["./node_modules/.bin/cf", ...args], {
  stdout: "inherit",
  stderr: "inherit",
})

process.exit(result.exitCode ?? 1)
