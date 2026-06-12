import { eq } from "drizzle-orm"
import type { useAppSession } from "@/auth/session.server"
import { getDb } from "@/db"
import * as schema from "@/db/schema"

export async function getUserById(userId: number) {
  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  })

  return user
}

export async function getUserByEmail(email: string) {
  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  })
  return user
}

export async function getOrCreateUserByEmail(email: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    const db = getDb()
    const results = await db.insert(schema.users).values({ email }).returning()
    return results[0]
  }

  return user
}

export async function getUserId(
  session: Awaited<ReturnType<typeof useAppSession>>,
) {
  const userId = session.data.userId
  return userId ? Number(userId) : 0
}

export async function isValidUserId(userId: number) {
  const db = getDb()
  const user = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(schema.users.id, userId),
  })

  return !!user
}
