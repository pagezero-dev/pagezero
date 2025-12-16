import { defineConfig } from "drizzle-kit"
import { getDbCredentials } from "@/db/utils"

export default defineConfig({
  dialect: "sqlite",
  schema: "./packages/db/schema.ts",
  out: "./packages/db/migrations",
  ...getDbCredentials(),
})
