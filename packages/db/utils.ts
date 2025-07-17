import glob from "fast-glob"
import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { config } from "@dotenvx/dotenvx"
import { drizzle as drizzleRemote } from "./d1-http-driver"

export function getLocalSqliteDbUrl() {
  const dbUrls = glob.sync("./.wrangler/**/*.sqlite")

  if (dbUrls.length > 1) {
    throw new Error("Multiple SQLite databases found")
  }

  if (dbUrls.length === 0) {
    throw new Error("No SQLite databases found")
  }

  return dbUrls[0]
}

export function getLocalOrRemoteDb() {
  config({ path: ".dev.vars" })
  if (
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_DATABASE_ID &&
    process.env.CLOUDFLARE_API_TOKEN
  ) {
    console.log("🎫 Cloudflare credentials found")
    console.log("🔗 Connecting to remote db...")
    return drizzleRemote(
      {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID,
        token: process.env.CLOUDFLARE_API_TOKEN,
      },
      { logger: true },
    )
  } else {
    console.log("🔗 Connecting to local db...")
    return drizzleLocal(new Database(getLocalSqliteDbUrl()), { logger: true })
  }
}
