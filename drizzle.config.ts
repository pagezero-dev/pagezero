import { defineConfig } from "drizzle-kit"
import { getLocalSqliteDbUrl } from "./db/utils"

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: getLocalSqliteDbUrl(),
  },
})
