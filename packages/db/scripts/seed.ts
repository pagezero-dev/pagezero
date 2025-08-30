import { greetings } from "../schema"
import { getLocalOrRemoteDb } from "../utils"

async function main() {
  const db = getLocalOrRemoteDb()
  console.log("🌱 Seeding database...")

  await db.insert(greetings).values({ greeting: "Database says hello!" })

  console.log("✅ Seeding complete!")
}

main().catch((error) => {
  console.error("❌ Seeding failed!")
  console.error(error)
  process.exit(1)
})
