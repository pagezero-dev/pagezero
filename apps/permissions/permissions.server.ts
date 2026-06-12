import { and, eq } from "drizzle-orm"
import config, { userRoles } from "@/config"
import { getDb } from "@/db"
import * as schema from "@/db/schema"
import type { UnionKeys } from "@/types/utils"

export type PermissionsConfig = {
  permissions: { roleToPermissions: Record<Role, Record<string, boolean>> }
}

export type Role = (typeof userRoles)[number]

export type Permission = UnionKeys<
  (typeof config)["permissions"]["roleToPermissions"][Role]
>

export async function hasUserRole(userId: number, roleName: Role) {
  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      roles: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user.roles.some((role) => role.roleName === roleName)
}

export async function grantUserRole(userId: number, roleName: Role) {
  const db = getDb()
  await db.insert(schema.userRoles).values({ userId, roleName })
}

export async function revokeUserRole(userId: number, roleName: Role) {
  const db = getDb()
  await db
    .delete(schema.userRoles)
    .where(
      and(
        eq(schema.userRoles.userId, userId),
        eq(schema.userRoles.roleName, roleName),
      ),
    )
}
