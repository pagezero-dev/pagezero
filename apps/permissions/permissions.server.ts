import { and, eq } from "drizzle-orm"
import { DrizzleD1Database } from "drizzle-orm/d1"
import { data } from "react-router"
import config, { userRoles } from "@/config"
import * as schema from "@/db/schema"
import type { UnionKeys } from "@/types/utils"

export type PermissionsConfig = {
  permissions: { roleToPermissions: Record<Role, Record<string, boolean>> }
}

export type Role = (typeof userRoles)[number]

export type Permission = UnionKeys<
  (typeof config)["permissions"]["roleToPermissions"][Role]
>

const getRolePermissions = (roleName: Role, config: PermissionsConfig) => {
  return Object.entries(config.permissions.roleToPermissions[roleName] ?? {})
    .filter(([_, value]) => value)
    .map(([key]) => key)
}

export async function requireUserPermissions(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  permissions: Permission[],
) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      roles: true,
    },
  })

  if (!user) {
    throw data({ error: "User not found" }, { status: 401 })
  }

  const userPermissions = user.roles.flatMap((role) =>
    getRolePermissions(role.roleName, config),
  )

  if (
    !permissions.every((permission) => userPermissions.includes(permission))
  ) {
    throw data(
      { error: "User does not have the required permissions" },
      { status: 403 },
    )
  }

  return user.id
}

export async function hasUserRole(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  roleName: Role,
) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      roles: true,
    },
  })

  if (!user) {
    throw data({ error: "User not found" }, { status: 401 })
  }

  if (user.roles.some((role) => role.roleName === roleName)) {
    return true
  }

  return false
}

export async function requireUserRole(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  roleName: Role,
) {
  if (!(await hasUserRole(db, userId, roleName))) {
    throw data(
      { error: "User does not have the required role" },
      { status: 403 },
    )
  }
}

export async function grantUserRole(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  roleName: Role,
) {
  await db.insert(schema.userRoles).values({ userId, roleName })
}

export async function revokeUserRole(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  roleName: Role,
) {
  await db
    .delete(schema.userRoles)
    .where(
      and(
        eq(schema.userRoles.userId, userId),
        eq(schema.userRoles.roleName, roleName),
      ),
    )
}
