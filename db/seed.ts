import { getLocalOrRemoteDb } from "./utils"
// import {  } from "./schema"

async function main() {
  const db = getLocalOrRemoteDb()
  console.log("🌱 Seeding database...")

  // await db.insert().values({ })

  console.log("✅ Seeding complete!")
}

main().catch((error) => {
  console.error("❌ Seeding failed!")
  console.error(error)
  process.exit(1)
})
