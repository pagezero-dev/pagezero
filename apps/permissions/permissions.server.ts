import { and, eq } from "drizzle-orm"
import config, { userRoles } from "@/config"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import type { UnionKeys } from "@/types/utils"

export type PermissionsConfig = {
  permissions: { roleToPermissions: Record<Role, Record<string, boolean>> }
}

export type Role = (typeof userRoles)[number]

export type Permission = UnionKeys<
  (typeof config)["permissions"]["roleToPermissions"][Role]
>

const getRolePermissions = (roleName: Role) => {
  return Object.entries(config.permissions.roleToPermissions[roleName] ?? {})
    .filter(([_, value]) => value)
    .map(([key]) => key)
}

export async function hasUserRole(userId: number, roleName: Role) {
  const db = getMainDb()
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

export async function hasUserPermissions(
  userId: number,
  permissions: Permission[],
) {
  const db = getMainDb()
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      roles: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const userPermissions = user.roles.flatMap((role) =>
    getRolePermissions(role.roleName),
  )

  return permissions.every((permission) => userPermissions.includes(permission))
}

export async function grantUserRole(userId: number, roleName: Role) {
  const db = getMainDb()
  await db.insert(schema.userRoles).values({ userId, roleName })
}

export async function revokeUserRole(userId: number, roleName: Role) {
  const db = getMainDb()
  await db
    .delete(schema.userRoles)
    .where(
      and(
        eq(schema.userRoles.userId, userId),
        eq(schema.userRoles.roleName, roleName),
      ),
    )
}
