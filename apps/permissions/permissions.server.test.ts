import fs from "node:fs"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { getDb } from "@/db"
import * as schema from "@/db/schema"
import { users } from "@/user/db/schema"
import { userRoles } from "./db/schema"
import {
  grantUserRole,
  hasUserRole,
  type PermissionsConfig,
  type Role,
  revokeUserRole,
} from "./permissions.server"

vi.mock("@/db", () => ({
  getDb: vi.fn(),
}))

vi.mock("@/config", () => ({
  default: {
    permissions: {
      roleToPermissions: {
        admin: { read: true, write: true, delete: true },
      } as unknown as Record<Role, Record<string, boolean>>,
    },
  } satisfies PermissionsConfig,
}))

describe("Permissions", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<
    typeof schema
  >
  const defaultUserId = 1
  const adminUserId = 2

  beforeAll(async () => {
    // Create schema
    const migrationSql = fs.readFileSync("./packages/db/schema.sql", "utf-8")
    sqlite.exec(migrationSql)
  })

  beforeEach(async () => {
    vi.mocked(getDb).mockReturnValue(db as ReturnType<typeof getDb>)

    // Clear tables
    sqlite.exec("PRAGMA foreign_keys = OFF")
    await db.delete(users)
    await db.delete(userRoles)
    sqlite.exec("PRAGMA foreign_keys = ON")

    // Insert test users
    await db.insert(users).values([
      { id: defaultUserId, email: "default@example.com" }, // default user
      { id: adminUserId, email: "admin@example.com" }, // admin user
    ])

    // Insert user roles relations
    await db
      .insert(userRoles)
      .values([{ userId: adminUserId, roleName: "admin" as Role }])
  })

  describe("hasUserRole", () => {
    it("should return true if user has required role", async () => {
      const result = await hasUserRole(adminUserId, "admin" as unknown as Role)
      expect(result).toBe(true)
    })

    it("should return false if user does not have required role", async () => {
      const result = await hasUserRole(
        defaultUserId,
        "admin" as unknown as Role,
      )
      expect(result).toBe(false)
    })
  })

  describe("grantUserRole", () => {
    it("should update user role", async () => {
      expect(await hasUserRole(defaultUserId, "admin" as unknown as Role)).toBe(
        false,
      )

      await grantUserRole(defaultUserId, "admin" as unknown as Role)

      expect(await hasUserRole(defaultUserId, "admin" as unknown as Role)).toBe(
        true,
      )
    })
  })

  describe("revokeUserRole", () => {
    it("should revoke user role", async () => {
      expect(await hasUserRole(adminUserId, "admin" as unknown as Role)).toBe(
        true,
      )

      await revokeUserRole(adminUserId, "admin" as unknown as Role)
      expect(await hasUserRole(adminUserId, "admin" as unknown as Role)).toBe(
        false,
      )
    })
  })

  afterAll(() => {
    // Close the database connection
    sqlite.close()
  })
})
