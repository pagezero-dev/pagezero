import { relations } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"
import config from "@/config"
import type { NonEmptyArray } from "@/types/utils"
import { users } from "@/user/db/schema"
import type { Role } from "../permissions.server"

// Define tables
export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: integer("user_id").references(() => users.id),
    roleName: text("role_name", {
      enum: Object.keys(
        config.permissions.roleToPermissions,
      ) as NonEmptyArray<Role>,
    }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleName] })],
)

// Define relations
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}))
