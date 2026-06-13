import { relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { userRoles } from "@/permissions/db/schema"

// Define tables
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
})

// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
}))
