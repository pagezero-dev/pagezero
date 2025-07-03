import { defineConfig } from "drizzle-kit"
import { getLocalSqliteDbUrl } from "./db/utils"

if (
  process.env.CI &&
  (!process.env.CLOUDFLARE_ACCOUNT_ID ||
    !process.env.CLOUDFLARE_DATABASE_ID ||
    !process.env.CLOUDFLARE_API_TOKEN)
) {
  throw new Error("Missing Cloudflare credentials")
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  ...(process.env.CI
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
