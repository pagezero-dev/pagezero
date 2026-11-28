import crypto from "node:crypto"

import type { Config } from "drizzle-kit"

import { getCloudflareConfig } from "../config/cloudflare/index.ts"

function getArg(flag: string) {
  const index = process.argv.indexOf(flag)
  if (index === -1) {
    return undefined
  }
  const value = process.argv[index + 1]
  if (value === undefined || value.startsWith("-")) {
    return undefined
  }
  return value
}

const DEFAULT_DB_BINDING = "DB_MAIN"
const MINIFLARE_D1_UNIQUE_KEY = "miniflare-D1DatabaseObject"

function getDatabase(mode?: string, dbBinding = DEFAULT_DB_BINDING) {
  const database = getCloudflareConfig(mode).d1.find((entry) => entry.binding === dbBinding)

  if (!database?.id) {
    throw new Error(
      `D1 database ID not found for binding ${dbBinding} in mode: ${mode ?? "development"}`,
    )
  }

  return { ...database, id: database.id }
}

function getLocalSqliteDbUrl(databaseId: string) {
  const key = crypto.createHash("sha256").update(MINIFLARE_D1_UNIQUE_KEY).digest()
  const nameHmac = crypto.createHmac("sha256", key).update(databaseId).digest().subarray(0, 16)
  const hmac = crypto.createHmac("sha256", key).update(nameHmac).digest().subarray(0, 16)

  const hash = Buffer.concat([nameHmac, hmac]).toString("hex")

  return `./.cloudflare/state/v3/d1/${MINIFLARE_D1_UNIQUE_KEY}/${hash}.sqlite`
}

export function getConfig({
  dbBinding = DEFAULT_DB_BINDING,
  mode,
  accountId,
  token,
}: {
  dbBinding?: string
  mode?: string
  accountId?: string
  token?: string
}): Config {
  const isRemote = mode && ["production", "preview"].includes(mode)

  const dbRootName = dbBinding.replace("DB_", "").toLowerCase()
  const database = getDatabase(mode, dbBinding)
  const dialect = "sqlite"
  const schema = `./packages/db/${dbRootName}/schema.ts`
  const out = database.migrationsDir ?? `./packages/db/${dbRootName}/migrations`

  if (isRemote) {
    if (!accountId || !token) {
      throw new Error("Account ID and token are required for remote databases")
    }

    return {
      dialect,
      schema,
      out,
      driver: "d1-http",
      dbCredentials: {
        accountId,
        token,
        databaseId: database.id,
      },
    }
  }

  return {
    dialect,
    schema,
    out,
    dbCredentials: {
      url: getLocalSqliteDbUrl(database.id),
    },
  }
}

export default getConfig({
  dbBinding: process.env.DB_BINDING,
  mode: getArg("--mode"),
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  token: process.env.CLOUDFLARE_API_TOKEN,
})
