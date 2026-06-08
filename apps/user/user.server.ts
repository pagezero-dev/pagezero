import { eq } from "drizzle-orm"
import { DrizzleD1Database } from "drizzle-orm/d1"
import type { useAppSession } from "@/auth/session.server"
import * as schema from "@/db/schema"

export async function getUserById(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  })

  return user
}

export async function getUserByEmail(
  db: DrizzleD1Database<typeof schema>,
  email: string,
) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  })
  return user
}

export async function getOrCreateUserByEmail(
  db: DrizzleD1Database<typeof schema>,
  email: string,
) {
  const user = await getUserByEmail(db, email)

  if (!user) {
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

export async function isValidUserId(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
) {
  const user = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(schema.users.id, userId),
  })

  return !!user
}
