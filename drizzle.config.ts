import { defineConfig } from "drizzle-kit"
import { getLocalSqliteDbUrl } from "./packages/db/utils"

const hasCloudflareCredentials =
  process.env.CLOUDFLARE_ACCOUNT_ID &&
  process.env.CLOUDFLARE_DATABASE_ID &&
  process.env.CLOUDFLARE_API_TOKEN

export default defineConfig({
  dialect: "sqlite",
  schema: "./packages/db/schema.ts",
  out: "./packages/db/migrations",
  ...(hasCloudflareCredentials
    ? {
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          databaseId: process.env.CLOUDFLARE_DATABASE_ID,
          token: process.env.CLOUDFLARE_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalSqliteDbUrl(),
        },
      }),
})
