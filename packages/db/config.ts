import type { Config } from "drizzle-kit"
import { getDbCredentials } from "./utils"

export function getDrizzleConfig(): Config {
  return {
    dialect: "sqlite",
    schema: "./packages/db/main/schema.ts",
    out: "./packages/db/main/migrations",
    ...getDbCredentials(),
  }
}
