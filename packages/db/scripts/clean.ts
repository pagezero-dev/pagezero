import { getTableName, is, sql } from "drizzle-orm"
import { SQLiteTable } from "drizzle-orm/sqlite-core"
import * as schema from "../schema"
import { getLocalOrRemoteDb } from "../utils"

async function main() {
  const db = getLocalOrRemoteDb()

  console.log("🧹 Cleaning database...")
  const tables = Object.fromEntries(
    Object.entries(schema).filter((keyValue) => is(keyValue[1], SQLiteTable)),
  )

  await db.run(sql.raw(`PRAGMA foreign_keys = OFF`))

  await db.run(sql.raw(`drop table if exists __drizzle_migrations`))
  Object.values(tables).forEach(async (table) => {
    const tableName = getTableName(table as SQLiteTable)
    await db.run(sql.raw(`drop table if exists ${tableName}`))
  })

  await db.run(sql.raw(`PRAGMA foreign_keys = ON`))
  console.log("✅ Cleaning complete!")
}

main().catch((error) => {
  console.error("❌ Cleaning failed!")
  console.error(error)
  process.exit(1)
})
