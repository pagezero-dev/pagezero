import { sql } from "drizzle-orm"
import { getLocalOrRemoteDb } from "../utils"

async function main() {
  const db = getLocalOrRemoteDb()
  console.log("🧹 Cleaning database...")

  await db.run(sql`drop table if exists __drizzle_migrations`)
  await db.run(sql`drop table if exists greetings`)

  console.log("✅ Cleaning complete!")
}

main().catch((error) => {
  console.error("❌ Cleaning failed!")
  console.error(error)
  process.exit(1)
})
