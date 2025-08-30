import { config } from "@dotenvx/dotenvx"
import Database from "better-sqlite3"
import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3"
import glob from "fast-glob"
import { drizzle as drizzleRemote } from "./drivers/d1-http"

export function getLocalSqliteDbUrl() {
  const dbUrls = glob.sync("./.wrangler/state/v3/d1/**/*.sqlite")

  if (dbUrls.length > 1) {
    throw new Error("Multiple SQLite databases found")
  }

  if (dbUrls.length === 0) {
    throw new Error("No SQLite databases found")
  }

  return dbUrls[0]
}

export function getLocalOrRemoteDb() {
  config({ path: ".env" })
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
