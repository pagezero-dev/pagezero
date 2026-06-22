import { eq } from "drizzle-orm"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import type { useAppSession } from "./session.server"

export async function getUserById(userId: number) {
  const db = getMainDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  })

  return user
}

export async function getUserByEmail(email: string) {
  const db = getMainDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  })
  return user
}

export async function getOrCreateUserByEmail(email: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    const db = getMainDb()
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
  const db = getMainDb()
  const user = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(schema.users.id, userId),
  })

  return !!user
}
