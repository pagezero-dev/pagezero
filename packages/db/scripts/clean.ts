import { getTableName, sql } from "drizzle-orm"
import * as schema from "../schema"
import { getLocalOrRemoteDb } from "../utils"

async function main() {
  const db = getLocalOrRemoteDb()
  console.log("🧹 Cleaning database...")

  await db.run(sql.raw(`drop table if exists __drizzle_migrations`))
  Object.values(schema).forEach(async (table) => {
    const tableName = getTableName(table)
    await db.run(sql.raw(`drop table if exists ${tableName}`))
  })

  console.log("✅ Cleaning complete!")
}

main().catch((error) => {
  console.error("❌ Cleaning failed!")
  console.error(error)
  process.exit(1)
})
