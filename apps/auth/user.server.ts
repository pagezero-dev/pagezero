import { eq } from "drizzle-orm"

import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"

export async function getUserById(userId: string) {
  const db = getMainDb()
  return db.query.user.findFirst({
    where: eq(schema.user.id, userId),
  })
}

export async function getUserByEmail(email: string) {
  const db = getMainDb()
  return db.query.user.findFirst({
    where: eq(schema.user.email, email),
  })
}

export async function getOrCreateUserByEmail(email: string) {
  const existing = await getUserByEmail(email)
  if (existing) {
    return existing
  }

  const db = getMainDb()
  const now = new Date()
  const results = await db
    .insert(schema.user)
    .values({
      id: crypto.randomUUID(),
      name: email,
      email,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
      role: "user",
    })
    .returning()

  return results[0]
}

export function isValidUserId(userId: string | null | undefined): userId is string {
  return typeof userId === "string" && userId.length > 0
}
