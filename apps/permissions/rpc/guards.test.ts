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
import { users } from "@/auth/db/schema"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { userRoles } from "../db/schema"
import type { Permission, PermissionsConfig, Role } from "../permissions.server"
import { requireUserPermissions, requireUserRole } from "./guards"

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const { mockServerFn } = await import("@/test/mock-server-fn")
  return {
    ...(await importOriginal<typeof import("@tanstack/react-start")>()),
    ...mockServerFn(),
  }
})

vi.mock("@/db/main", () => ({
  getMainDb: vi.fn(),
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

describe("Guards", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<
    typeof schema
  >
  const defaultUserId = 1
  const adminUserId = 2

  beforeAll(async () => {
    // Create schema
    const migrationSql = fs.readFileSync(
      "./packages/db/main/schema.sql",
      "utf-8",
    )
    sqlite.exec(migrationSql)
  })

  beforeEach(async () => {
    vi.mocked(getMainDb).mockReturnValue(db as ReturnType<typeof getMainDb>)

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
      const result = await requireUserPermissions({
        data: {
          userId: adminUserId,
          permissions: ["read", "write", "delete"] as unknown as Permission[],
        },
      })
      expect(result).toBe(adminUserId)
    })

    it("throws if user not found", async () => {
      await expect(
        requireUserPermissions({
          data: {
            userId: 999,
            permissions: ["read"] as unknown as Permission[],
          },
        }),
      ).rejects.toThrow("User not found")
    })

    it("throws if user lacks required permissions", async () => {
      await expect(
        requireUserPermissions({
          data: {
            userId: defaultUserId,
            permissions: ["write"] as unknown as Permission[],
          },
        }),
      ).rejects.toThrow("User does not have the required permissions")
    })
  })

  describe("requireUserRole", () => {
    it("should not throw error if user has required role", async () => {
      await expect(
        requireUserRole({
          data: { userId: adminUserId, roleName: "admin" as unknown as Role },
        }),
      ).resolves.not.toThrow()
    })

    it("throws if user does not have required role", async () => {
      await expect(
        requireUserRole({
          data: { userId: defaultUserId, roleName: "admin" as unknown as Role },
        }),
      ).rejects.toThrow("User does not have the required role")
    })
  })

  afterAll(() => {
    // Close the database connection
    sqlite.close()
  })
})
