import crypto from "node:crypto"

import type { Config } from "drizzle-kit"

import { getConfig as getAppConfig } from "../config/index.ts"

const DEFAULT_DB_BINDING = "DB_MAIN"
const MINIFLARE_D1_UNIQUE_KEY = "miniflare-D1DatabaseObject"

function getDatabase(cloudflareEnv?: string, dbBinding = DEFAULT_DB_BINDING) {
  const database = getAppConfig(cloudflareEnv).cloudflare.d1.find(
    (entry) => entry.binding === dbBinding,
  )

  if (!database?.id) {
    throw new Error(
      `D1 database ID not found for binding ${dbBinding} in mode: ${cloudflareEnv ?? "development"}`,
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
  cloudflareEnv,
  accountId,
  token,
}: {
  dbBinding?: string
  cloudflareEnv?: string
  accountId?: string
  token?: string
}): Config {
  const isRemote = cloudflareEnv && ["production", "preview"].includes(cloudflareEnv)

  const dbRootName = dbBinding.replace("DB_", "").toLowerCase()
  const database = getDatabase(cloudflareEnv, dbBinding)
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
  cloudflareEnv: process.env.CLOUDFLARE_ENV,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  token: process.env.CLOUDFLARE_API_TOKEN,
})
