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
import * as schema from "@/db/schema"
import { users } from "@/user/db/schema"
import { userRoles } from "./db/schema"
import {
  grantUserRole,
  hasUserRole,
  type Permission,
  type PermissionsConfig,
  type Role,
  requireUserPermissions,
  requireUserRole,
  revokeUserRole,
} from "./permissions.server"

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

  describe("requireUserPermissions", () => {
    it("should return user id if user has all required permissions", async () => {
      const result = await requireUserPermissions(db, adminUserId, [
        "read",
        "write",
        "delete",
      ] as unknown as Permission[])
      expect(result).toBe(adminUserId)
    })

    it("should throw 401 if user not found", async () => {
      await expect(
        requireUserPermissions(db, 999, ["read"] as unknown as Permission[]),
      ).rejects.toMatchObject({
        type: "DataWithResponseInit",
        data: { error: "User not found" },
        init: { status: 401 },
      })
    })

    it("should throw 403 if user lacks required permissions", async () => {
      await expect(
        requireUserPermissions(db, defaultUserId, [
          "write",
        ] as unknown as Permission[]),
      ).rejects.toMatchObject({
        type: "DataWithResponseInit",
        data: { error: "User does not have the required permissions" },
        init: { status: 403 },
      })
    })
  })

  describe("hasUserRole", () => {
    it("should return true if user has required role", async () => {
      const result = await hasUserRole(
        db,
        adminUserId,
        "admin" as unknown as Role,
      )
      expect(result).toBe(true)
    })

    it("should return false if user does not have required role", async () => {
      const result = await hasUserRole(
        db,
        defaultUserId,
        "admin" as unknown as Role,
      )
      expect(result).toBe(false)
    })
  })

  describe("requireUserRole", () => {
    it("should not throw error if user has required role", async () => {
      await expect(
        requireUserRole(db, adminUserId, "admin" as unknown as Role),
      ).resolves.not.toThrow()
    })

    it("should throw 403 if user does not have required role", async () => {
      await expect(
        requireUserRole(db, defaultUserId, "admin" as unknown as Role),
      ).rejects.toMatchObject({
        type: "DataWithResponseInit",
        data: { error: "User does not have the required role" },
        init: { status: 403 },
      })
    })
  })

  describe("grantUserRole", () => {
    it("should update user role", async () => {
      expect(
        await hasUserRole(db, defaultUserId, "admin" as unknown as Role),
      ).toBe(false)

      await grantUserRole(db, defaultUserId, "admin" as unknown as Role)

      expect(
        await hasUserRole(db, defaultUserId, "admin" as unknown as Role),
      ).toBe(true)
    })
  })

  describe("revokeUserRole", () => {
    it("should revoke user role", async () => {
      expect(
        await hasUserRole(db, adminUserId, "admin" as unknown as Role),
      ).toBe(true)

      await revokeUserRole(db, adminUserId, "admin" as unknown as Role)
      expect(
        await hasUserRole(db, adminUserId, "admin" as unknown as Role),
      ).toBe(false)
    })
  })

  afterAll(() => {
    // Close the database connection
    sqlite.close()
  })
})
