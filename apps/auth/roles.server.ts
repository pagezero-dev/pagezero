import { eq } from "drizzle-orm"

import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"

import type { PaidRole } from "./access"
import { getUserById } from "./user.server"

function parseRoles(role: string | null | undefined): string[] {
  if (!role) return []
  return role
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function serializeRoles(roles: string[]): string {
  return [...new Set(roles)].join(",")
}

export async function hasUserRole(userId: string, roleName: PaidRole | string) {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error("User not found")
  }
  return parseRoles(user.role).includes(roleName)
}

export async function grantUserRole(userId: string, roleName: PaidRole | string) {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error("User not found")
  }

  const roles = parseRoles(user.role)
  if (roles.includes(roleName)) {
    return
  }

  roles.push(roleName)
  const db = getMainDb()
  await db
    .update(schema.user)
    .set({ role: serializeRoles(roles) })
    .where(eq(schema.user.id, userId))
}

export async function revokeUserRole(userId: string, roleName: PaidRole | string) {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error("User not found")
  }

  const roles = parseRoles(user.role).filter((role) => role !== roleName)
  const db = getMainDb()
  await db
    .update(schema.user)
    .set({ role: serializeRoles(roles.length > 0 ? roles : ["user"]) })
    .where(eq(schema.user.id, userId))
}
