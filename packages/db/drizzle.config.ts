import crypto from "node:crypto"
import { defineConfig } from "drizzle-kit"
import wranglerConfig from "../../wrangler.json"

const DB_BINDING = process.env.DB_BINDING || "DB_MAIN"
const MINIFLARE_D1_UNIQUE_KEY = "miniflare-D1DatabaseObject"

function durableObjectNamespaceIdFromName(uniqueKey: string, name: string) {
  const key = crypto.createHash("sha256").update(uniqueKey).digest()
  const nameHmac = crypto
    .createHmac("sha256", key)
    .update(name)
    .digest()
    .subarray(0, 16)
  const hmac = crypto
    .createHmac("sha256", key)
    .update(nameHmac)
    .digest()
    .subarray(0, 16)

  return Buffer.concat([nameHmac, hmac]).toString("hex")
}

type CloudflareEnv = keyof typeof wranglerConfig.env

function isValidCloudflareEnv(value?: string): value is CloudflareEnv {
  return !!value && value in wranglerConfig.env
}

function getD1DatabaseByBinding(binding: string, cloudflareEnv?: string) {
  const databases = isValidCloudflareEnv(cloudflareEnv)
    ? wranglerConfig.env[cloudflareEnv].d1_databases
    : wranglerConfig.d1_databases
  const database = databases.find((db) => db.binding === binding)

  if (!database) {
    throw new Error(`D1 database binding not found: ${binding}`)
  }

  return database
}

function getLocalSqliteDbUrl(databaseId: string) {
  const hash = durableObjectNamespaceIdFromName(
    MINIFLARE_D1_UNIQUE_KEY,
    databaseId,
  )

  return `./.wrangler/state/v3/d1/${MINIFLARE_D1_UNIQUE_KEY}/${hash}.sqlite`
}

export function getDbCredentials() {
  const isRemote =
    process.env.CLOUDFLARE_ENV &&
    ["production", "preview"].includes(process.env.CLOUDFLARE_ENV)

  const databaseId = getD1DatabaseByBinding(
    DB_BINDING,
    process.env.CLOUDFLARE_ENV,
  ).database_id

  if (isRemote) {
    return {
      driver: "d1-http",
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        token: process.env.CLOUDFLARE_API_TOKEN,
        databaseId,
      },
    }
  }

  return {
    dbCredentials: {
      url: getLocalSqliteDbUrl(databaseId),
    },
  }
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./packages/db/main/schema.ts",
  out: "./packages/db/main/migrations",
  ...getDbCredentials(),
})
