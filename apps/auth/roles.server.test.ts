import { Database } from "bun:sqlite"
import fs from "node:fs"

import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/bun-sqlite"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { user } from "@/db/main/schema"

import { grantUserRole, hasUserRole, revokeUserRole } from "./roles.server"

vi.mock("@/db/main", () => ({
  getMainDb: vi.fn(),
}))

describe("roles.server", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<typeof schema>
  const defaultUserId = "user-1"
  const premiumUserId = "user-2"

  beforeAll(async () => {
    const migrationSql = fs.readFileSync("./packages/db/main/schema.sql", "utf-8")
    sqlite.exec(migrationSql)
  })

  afterAll(() => {
    sqlite.close()
  })

  beforeEach(async () => {
    vi.mocked(getMainDb).mockReturnValue(db as ReturnType<typeof getMainDb>)

    sqlite.exec("PRAGMA foreign_keys = OFF")
    await db.delete(user)
    sqlite.exec("PRAGMA foreign_keys = ON")

    const now = new Date()
    await db.insert(user).values([
      {
        id: defaultUserId,
        name: "default@example.com",
        email: "default@example.com",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
        role: "user",
      },
      {
        id: premiumUserId,
        name: "premium@example.com",
        email: "premium@example.com",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
        role: "user,premium",
      },
    ])
  })

  describe("hasUserRole", () => {
    it("should return true if user has required role", async () => {
      const result = await hasUserRole(premiumUserId, "premium")
      expect(result).toBe(true)
    })

    it("should return false if user does not have required role", async () => {
      const result = await hasUserRole(defaultUserId, "premium")
      expect(result).toBe(false)
    })

    it("throws if user not found", async () => {
      await expect(hasUserRole("missing-user", "premium")).rejects.toThrow("User not found")
    })
  })

  describe("grantUserRole", () => {
    it("should update user role", async () => {
      expect(await hasUserRole(defaultUserId, "premium")).toBe(false)

      await grantUserRole(defaultUserId, "premium")

      expect(await hasUserRole(defaultUserId, "premium")).toBe(true)
    })

    it("should be a no-op if user already has the role", async () => {
      await grantUserRole(premiumUserId, "premium")

      expect(await hasUserRole(premiumUserId, "premium")).toBe(true)
      const updated = await db.query.user.findFirst({
        where: eq(user.id, premiumUserId),
      })
      expect(updated?.role).toBe("user,premium")
    })

    it("throws if user not found", async () => {
      await expect(grantUserRole("missing-user", "premium")).rejects.toThrow("User not found")
    })
  })

  describe("revokeUserRole", () => {
    it("should revoke user role", async () => {
      expect(await hasUserRole(premiumUserId, "premium")).toBe(true)

      await revokeUserRole(premiumUserId, "premium")

      expect(await hasUserRole(premiumUserId, "premium")).toBe(false)
      expect(await hasUserRole(premiumUserId, "user")).toBe(true)
    })

    it("should fall back to user when revoking the last role", async () => {
      await db.update(user).set({ role: "premium" }).where(eq(user.id, premiumUserId))

      await revokeUserRole(premiumUserId, "premium")

      const updated = await db.query.user.findFirst({
        where: eq(user.id, premiumUserId),
      })
      expect(updated?.role).toBe("user")
    })

    it("throws if user not found", async () => {
      await expect(revokeUserRole("missing-user", "premium")).rejects.toThrow("User not found")
    })
  })
})
