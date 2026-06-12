import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import config from "@/config"
import { getDb } from "@/db"
import * as schema from "@/db/schema"
import { hasUserRole, type Permission, type Role } from "./permissions.server"

const getRolePermissions = (roleName: Role) => {
  return Object.entries(config.permissions.roleToPermissions[roleName] ?? {})
    .filter(([_, value]) => value)
    .map(([key]) => key)
}

export const requireUserPermissions = createServerFn({ method: "GET" })
  .validator((data: { userId: number; permissions: Permission[] }) => data)
  .handler(async ({ data: { userId, permissions } }) => {
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

    const userPermissions = user.roles.flatMap((role) =>
      getRolePermissions(role.roleName),
    )

    if (
      !permissions.every((permission) => userPermissions.includes(permission))
    ) {
      throw new Error("User does not have the required permissions")
    }

    return user.id
  })

export const requireUserRole = createServerFn({ method: "GET" })
  .validator((data: { userId: number; roleName: Role }) => data)
  .handler(async ({ data: { userId, roleName } }) => {
    if (!(await hasUserRole(userId, roleName))) {
      throw new Error("User does not have the required role")
    }
  })
