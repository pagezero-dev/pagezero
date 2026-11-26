import { spawnSync } from "bun"

import { detectMode } from "@/config"

import { getCloudflareConfig } from "../../cloudflare.config.ts"

/**
 * `cf migrate` drops Wrangler `migrations_dir` / `migrations_table`.
 * `cf d1 migrations apply` takes a database ID (not a binding name) and
 * defaults to the remote database — local scripts must pass `--local`.
 */
const local = process.argv.includes("--local")
const mode = detectMode()
const { d1 } = getCloudflareConfig(mode)
const binding = process.env.DB_BINDING

const databases = d1.filter((database) => (binding ? database.binding === binding : true))

if (databases.length === 0) {
  console.error(
    `No D1 database found for mode "${mode ?? "development"}"${binding ? ` binding ${binding}` : ""}.`,
  )
  process.exit(1)
}

for (const database of databases) {
  if (!database.id) {
    console.error(
      `D1 database ID is missing for ${database.binding} in mode "${mode ?? "development"}".`,
    )
    process.exit(1)
  }
  if (!database.migrationsDir) {
    console.error(`D1 migrationsDir is missing for ${database.binding}.`)
    process.exit(1)
  }

  const args = [
    "d1",
    "migrations",
    "apply",
    database.id,
    "--dir",
    database.migrationsDir,
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
  if (result.exitCode) {
    process.exit(result.exitCode)
  }
}
