import { createServerFn } from "@tanstack/react-start"
import {
  hasUserPermissions,
  hasUserRole,
  type Permission,
  type Role,
} from "./permissions.server"

export const requireUserPermissions = createServerFn({ method: "GET" })
  .validator((data: { userId: number; permissions: Permission[] }) => data)
  .handler(async ({ data: { userId, permissions } }) => {
    if (!(await hasUserPermissions(userId, permissions))) {
      throw new Error("User does not have the required permissions")
    }

    return userId
  })

export const requireUserRole = createServerFn({ method: "GET" })
  .validator((data: { userId: number; roleName: Role }) => data)
  .handler(async ({ data: { userId, roleName } }) => {
    if (!(await hasUserRole(userId, roleName))) {
      throw new Error("User does not have the required role")
    }
  })
