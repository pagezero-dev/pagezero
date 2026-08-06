import fs from "node:fs"

import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { grantUserRole, hasUserRole } from "@/auth/roles.server"
import { getUserByEmail } from "@/auth/user.server"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { user } from "@/db/main/schema"
import {
  sendAccessFailureEmail,
  sendAccessGrantedEmail,
  sendAccessRevokedEmail,
} from "@/email/templates.server"

import { onPaymentRevoked, onPaymentSuccess } from "./handlers.server"
import type { PaymentsConfig } from "./types"

vi.mock("@/db/main", () => ({
  getMainDb: vi.fn(),
}))

vi.mock("@/email/templates.server")

vi.mock("@/config", () => ({
  default: {
    payments: {
      products: {
        pro: {
          name: "Pro",
          userRoleToGrant: "premium",
          polarProductId: {
            preview: "pro-preview-product-id",
            production: "pro-production-product-id",
          },
        },
      },
    },
  } satisfies PaymentsConfig,
}))

describe("payment handlers", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<typeof schema>
  const existingUserId = "user-1"

  beforeAll(async () => {
    const migrationSql = fs.readFileSync("./packages/db/main/schema.sql", "utf-8")
    sqlite.exec(migrationSql)
  })

  afterAll(() => {
    sqlite.close()
  })

  beforeEach(async () => {
    vi.mocked(getMainDb).mockReturnValue(db as ReturnType<typeof getMainDb>)
    vi.clearAllMocks()

    sqlite.exec("PRAGMA foreign_keys = OFF")
    await db.delete(user)
    sqlite.exec("PRAGMA foreign_keys = ON")

    const now = new Date()
    await db.insert(user).values([
      {
        id: existingUserId,
        name: "existing@example.com",
        email: "existing@example.com",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
        role: "user",
      },
    ])
  })

  describe.each(["order.paid", "subscription.active"] as const)("on '%s' event", (eventType) => {
    it("grants access to a new user", async () => {
      await onPaymentSuccess({
        type: eventType,
        timestamp: new Date(),
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "new@example.com",
          },
        },
      } as Parameters<typeof onPaymentSuccess>[0])

      const created = await getUserByEmail("new@example.com")
      if (!created) {
        throw new Error("User not found")
      }
      expect(await hasUserRole(created.id, "premium")).toBe(true)
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "new@example.com",
        productName: "Pro",
      })
    })

    it("grants access to an existing user", async () => {
      expect(await hasUserRole(existingUserId, "premium")).toBe(false)
      await onPaymentSuccess({
        type: eventType,
        timestamp: new Date(),
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as Parameters<typeof onPaymentSuccess>[0])

      expect(await hasUserRole(existingUserId, "premium")).toBe(true)
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        productName: "Pro",
      })
    })

    it("is a no-op when user already has access", async () => {
      await grantUserRole(existingUserId, "premium")

      await onPaymentSuccess({
        type: eventType,
        timestamp: new Date(),
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as Parameters<typeof onPaymentSuccess>[0])

      expect(sendAccessGrantedEmail).not.toHaveBeenCalled()
    })

    it("sends failure email when product is not found", async () => {
      await onPaymentSuccess({
        type: eventType,
        timestamp: new Date(),
        data: {
          productId: "not-found-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as Parameters<typeof onPaymentSuccess>[0])

      expect(sendAccessFailureEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
      })
    })
  })

  describe.each(["order.refunded", "subscription.revoked"] as const)(
    "on '%s' event",
    (eventType) => {
      it("revokes user access", async () => {
        await grantUserRole(existingUserId, "premium")
        await onPaymentRevoked({
          type: eventType,
          timestamp: new Date(),
          data: {
            productId: "pro-preview-product-id",
            customer: {
              email: "existing@example.com",
            },
          },
        } as Parameters<typeof onPaymentRevoked>[0])

        expect(await hasUserRole(existingUserId, "premium")).toBe(false)
        expect(sendAccessRevokedEmail).toHaveBeenCalledWith({
          to: "existing@example.com",
          productName: "Pro",
        })
      })

      it("is a no-op when user is not found", async () => {
        await onPaymentRevoked({
          type: eventType,
          timestamp: new Date(),
          data: {
            productId: "pro-preview-product-id",
            customer: {
              email: "not-found@example.com",
            },
          },
        } as Parameters<typeof onPaymentRevoked>[0])

        expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
      })

      it("is a no-op when product is not found", async () => {
        await onPaymentRevoked({
          type: eventType,
          timestamp: new Date(),
          data: {
            productId: "not-found-product-id",
            customer: {
              email: "existing@example.com",
            },
          },
        } as Parameters<typeof onPaymentRevoked>[0])

        expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
      })
    },
  )
})
