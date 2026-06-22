import fs from "node:fs"
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
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
import { getUserByEmail } from "@/auth/user.server"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { userRoles, users } from "@/db/main/schema"
import {
  sendAccessFailureEmail,
  sendAccessGrantedEmail,
  sendAccessRevokedEmail,
} from "@/email/templates.server"
import {
  grantUserRole,
  hasUserRole,
  type PermissionsConfig,
  type Role,
} from "@/permissions"
import type {
  PaymentsConfig,
  WebhookEvents,
  WebhookOrderPaidPayload,
  WebhookOrderRefundedPayload,
  WebhookSubscriptionActivePayload,
  WebhookSubscriptionRevokedPayload,
} from "../types"
import { Route } from "./webhook"

const { mockEnv } = vi.hoisted(() => ({
  mockEnv: {} as Env,
}))

vi.mock("cloudflare:workers", () => ({
  env: mockEnv,
}))

vi.mock("@/db/main", () => ({
  getMainDb: vi.fn(),
}))

vi.mock("@polar-sh/sdk/webhooks")
vi.mock("@/email/templates.server")

vi.mock("@/config", () => ({
  default: {
    permissions: {
      roleToPermissions: {
        pro: {
          viewProContent: true,
        },
      } as unknown as Record<Role, Record<string, boolean>>,
    },
    payments: {
      products: {
        pro: {
          name: "Pro",
          userRoleToGrant: "pro" as Role,
          polarProductId: {
            preview: "pro-preview-product-id",
            production: "pro-production-product-id",
          },
          checkoutLink: {
            preview:
              "https://sandbox-api.polar.sh/v1/checkout-links/pro-preview-product-id/redirect",
            production:
              "https://sandbox-api.polar.sh/v1/checkout-links/pro-production-product-id/redirect",
          },
        },
      },
    },
  } satisfies PaymentsConfig & PermissionsConfig,
}))

describe("Webhook", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<
    typeof schema
  >
  const existingUserId = 1
  const postHandler = (() => {
    const handlers = Route.options.server?.handlers
    if (!handlers || typeof handlers === "function" || !handlers.POST) {
      throw new Error("Webhook POST handler not found")
    }

    return handlers.POST as (ctx: { request: Request }) => Promise<Response>
  })()

  beforeAll(async () => {
    const migrationSql = fs.readFileSync(
      "./packages/db/main/schema.sql",
      "utf-8",
    )
    sqlite.exec(migrationSql)
  })

  afterAll(() => {
    sqlite.close()
  })

  beforeEach(async () => {
    for (const key of Reflect.ownKeys(mockEnv)) {
      Reflect.deleteProperty(mockEnv, key)
    }

    vi.mocked(getMainDb).mockReturnValue(db as ReturnType<typeof getMainDb>)

    sqlite.exec("PRAGMA foreign_keys = OFF")
    await db.delete(users)
    await db.delete(userRoles)
    sqlite.exec("PRAGMA foreign_keys = ON")

    await db
      .insert(users)
      .values([{ id: existingUserId, email: "existing@example.com" }])
  })

  function setEnv(env: Partial<Env>) {
    Object.assign(mockEnv, env)
  }

  it("throws an error when POLAR_WEBHOOK_SECRET is not set", async () => {
    setEnv({})
    await expect(
      postHandler({
        request: new Request("http://localhost"),
      }),
    ).rejects.toThrow("The Polar webhook secret is not set")
  })

  it("returns HTTP 403 when webhook verification fails", async () => {
    vi.mocked(validateEvent).mockImplementation(() => {
      throw new WebhookVerificationError("test")
    })
    setEnv({
      POLAR_WEBHOOK_SECRET: "test",
    })
    const response = await postHandler({
      request: new Request("http://localhost"),
    })
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Webhook verification failed")
  })

  it("returns HTTP 202 when event type is not handled", async () => {
    vi.mocked(validateEvent).mockReturnValue({
      type: "order.created",
      data: {},
    } as WebhookEvents)
    setEnv({
      POLAR_WEBHOOK_SECRET: "test",
    })
    const response = await postHandler({
      request: new Request("http://localhost"),
    })
    expect(response.status).toBe(202)
    expect(await response.text()).toBe("Event not handled")
  })

  describe.each([
    "order.paid",
    "subscription.active",
  ])("on '%s' event", async (eventType) => {
    it("grants access to a new user and returns HTTP 201", async () => {
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "new@example.com",
          },
        },
      } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })

      const user = await getUserByEmail("new@example.com")
      if (!user) {
        throw new Error("User not found")
      }
      expect(response.status).toBe(201)
      expect(await hasUserRole(user.id, "pro" as unknown as Role)).toBe(true)
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "new@example.com",
        productName: "Pro",
      })
    })

    it("grants access to an existing user and returns HTTP 201", async () => {
      expect(await hasUserRole(existingUserId, "pro" as unknown as Role)).toBe(
        false,
      )
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })
      expect(await hasUserRole(existingUserId, "pro" as unknown as Role)).toBe(
        true,
      )
      expect(response.status).toBe(201)
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        productName: "Pro",
      })
    })

    it("returns HTTP 200 when user already has access", async () => {
      await grantUserRole(existingUserId, "pro" as unknown as Role)

      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })

      expect(response.status).toBe(200)
      expect(await response.text()).toBe("User already has access")
      expect(sendAccessFailureEmail).not.toHaveBeenCalledWith()
    })

    it("returns HTTP 200 when product is not found", async () => {
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "not-found-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("Product not found")
      expect(sendAccessFailureEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
      })
    })
  })

  describe.each([
    "order.refunded",
    "subscription.revoked",
  ])("on '%s' event", async (eventType) => {
    it("revokes user access and returns HTTP 201", async () => {
      await grantUserRole(existingUserId, "pro" as unknown as Role)
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })
      expect(response.status).toBe(201)
      expect(await hasUserRole(existingUserId, "pro" as unknown as Role)).toBe(
        false,
      )
      expect(sendAccessRevokedEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        productName: "Pro",
      })
    })

    it("returns HTTP 200 when user is not found", async () => {
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "pro-preview-product-id",
          customer: {
            email: "not-found@example.com",
          },
        },
      } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("User not found")
      expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
    })

    it("returns HTTP 200 when product is not found", async () => {
      vi.mocked(validateEvent).mockReturnValue({
        type: eventType,
        data: {
          productId: "not-found-product-id",
          customer: {
            email: "existing@example.com",
          },
        },
      } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload)
      setEnv({
        POLAR_WEBHOOK_SECRET: "test",
      })
      const response = await postHandler({
        request: new Request("http://localhost"),
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("Product not found")
      expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
    })
  })
})
