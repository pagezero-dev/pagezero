import crypto from "node:crypto"
import type { Config } from "drizzle-kit"
import wranglerConfig from "../../wrangler.json"

const DEFAULT_DB_BINDING = "DB_MAIN"
const MINIFLARE_D1_UNIQUE_KEY = "miniflare-D1DatabaseObject"

type CloudflareEnv = keyof typeof wranglerConfig.env

function isValidCloudflareEnv(value?: string): value is CloudflareEnv {
  return !!value && value in wranglerConfig.env
}

function getDbId(binding: string, cloudflareEnv?: string) {
  const databases = isValidCloudflareEnv(cloudflareEnv)
    ? wranglerConfig.env[cloudflareEnv].d1_databases
    : wranglerConfig.d1_databases
  const database = databases.find((db) => db.binding === binding)

  if (!database) {
    throw new Error(`D1 database binding not found: ${binding}`)
  }

  if (!("database_id" in database)) {
    throw new Error(`D1 database ID not found: ${binding}`)
  }

  return database.database_id
}

function getLocalSqliteDbUrl(databaseId: string) {
  const key = crypto
    .createHash("sha256")
    .update(MINIFLARE_D1_UNIQUE_KEY)
    .digest()
  const nameHmac = crypto
    .createHmac("sha256", key)
    .update(databaseId)
    .digest()
    .subarray(0, 16)
  const hmac = crypto
    .createHmac("sha256", key)
    .update(nameHmac)
    .digest()
    .subarray(0, 16)

  const hash = Buffer.concat([nameHmac, hmac]).toString("hex")

  return `./.wrangler/state/v3/d1/${MINIFLARE_D1_UNIQUE_KEY}/${hash}.sqlite`
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
  const isRemote =
    cloudflareEnv && ["production", "preview"].includes(cloudflareEnv)

  const dbRootName = dbBinding.replace("DB_", "").toLowerCase()
  const databaseId = getDbId(dbBinding, cloudflareEnv)
  const dialect = "sqlite"
  const schema = `./packages/db/${dbRootName}/schema.ts`
  const out = `./packages/db/${dbRootName}/migrations`

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
        databaseId,
      },
    }
  }

  return {
    dialect,
    schema,
    out,
    dbCredentials: {
      url: getLocalSqliteDbUrl(databaseId),
    },
  }
}

export default getConfig({
  dbBinding: process.env.DB_BINDING,
  cloudflareEnv: process.env.CLOUDFLARE_ENV,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  token: process.env.CLOUDFLARE_API_TOKEN,
})
