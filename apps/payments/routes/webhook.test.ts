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
import * as schema from "@/db/schema"
import { userRoles, users } from "@/db/schema"
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
import { getUserByEmail } from "@/user/user.server"
import { onPaymentRevoked, onPaymentSuccess } from "../handlers.server"
import type {
  PaymentsConfig,
  WebhookEvents,
  WebhookOrderPaidPayload,
  WebhookOrderRefundedPayload,
  WebhookSubscriptionActivePayload,
  WebhookSubscriptionRevokedPayload,
} from "../types"

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

async function handleWebhook(request: Request, env: Env) {
  try {
    if (!env.POLAR_WEBHOOK_SECRET) {
      throw new Error("The Polar webhook secret is not set")
    }

    const payload = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    const db = drizzle(new Database(":memory:"), {
      schema,
    }) as unknown as DrizzleD1Database<typeof schema>

    const event: WebhookEvents = validateEvent(
      payload,
      headers,
      env.POLAR_WEBHOOK_SECRET,
    )

    switch (event.type) {
      case "order.paid":
      case "subscription.active":
        return onPaymentSuccess(event, db, env)
      case "order.refunded":
      case "subscription.revoked":
        return onPaymentRevoked(event, db, env)
      default:
        return new Response("Event not handled", { status: 202 })
    }
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return new Response("Webhook verification failed", { status: 403 })
    }

    throw error
  }
}

describe("Webhook", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<
    typeof schema
  >
  const existingUserId = 1

  beforeAll(async () => {
    const migrationSql = fs.readFileSync("./packages/db/schema.sql", "utf-8")
    sqlite.exec(migrationSql)
  })

  afterAll(() => {
    sqlite.close()
  })

  beforeEach(async () => {
    sqlite.exec("PRAGMA foreign_keys = OFF")
    await db.delete(users)
    await db.delete(userRoles)
    sqlite.exec("PRAGMA foreign_keys = ON")

    await db
      .insert(users)
      .values([{ id: existingUserId, email: "existing@example.com" }])
  })

  async function postWebhook(env: Env) {
    return handleWebhook(new Request("http://localhost"), env)
  }

  it("throws an error when POLAR_WEBHOOK_SECRET is not set", async () => {
    await expect(postWebhook({} as Env)).rejects.toThrow(
      "The Polar webhook secret is not set",
    )
  })

  it("returns HTTP 403 when webhook verification fails", async () => {
    vi.mocked(validateEvent).mockImplementation(() => {
      throw new WebhookVerificationError("test")
    })
    const response = await postWebhook({
      POLAR_WEBHOOK_SECRET: "test",
    } as Env)
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Webhook verification failed")
  })

  it("returns HTTP 202 when event type is not handled", async () => {
    vi.mocked(validateEvent).mockReturnValue({
      type: "order.created",
      data: {},
    } as WebhookEvents)
    const response = await postWebhook({
      POLAR_WEBHOOK_SECRET: "test",
    } as Env)
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

      const response = await onPaymentSuccess(
        {
          type: eventType,
          data: {
            productId: "pro-preview-product-id",
            customer: { email: "new@example.com" },
          },
        } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )

      const user = await getUserByEmail(db, "new@example.com")
      if (!user) {
        throw new Error("User not found")
      }
      expect(response.status).toBe(201)
      expect(await hasUserRole(db, user.id, "pro" as unknown as Role)).toBe(
        true,
      )
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "new@example.com",
        env: { POLAR_WEBHOOK_SECRET: "test" },
        productName: "Pro",
      })
    })

    it("grants access to an existing user and returns HTTP 201", async () => {
      expect(
        await hasUserRole(db, existingUserId, "pro" as unknown as Role),
      ).toBe(false)
      const response = await onPaymentSuccess(
        {
          type: eventType,
          data: {
            productId: "pro-preview-product-id",
            customer: { email: "existing@example.com" },
          },
        } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )
      expect(
        await hasUserRole(db, existingUserId, "pro" as unknown as Role),
      ).toBe(true)
      expect(response.status).toBe(201)
      expect(sendAccessGrantedEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        env: { POLAR_WEBHOOK_SECRET: "test" },
        productName: "Pro",
      })
    })

    it("returns HTTP 200 when user already has access", async () => {
      await grantUserRole(db, existingUserId, "pro" as unknown as Role)

      const response = await onPaymentSuccess(
        {
          type: eventType,
          data: {
            productId: "pro-preview-product-id",
            customer: { email: "existing@example.com" },
          },
        } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )

      expect(response.status).toBe(200)
      expect(await response.text()).toBe("User already has access")
      expect(sendAccessFailureEmail).not.toHaveBeenCalledWith()
    })

    it("returns HTTP 200 when product is not found", async () => {
      const response = await onPaymentSuccess(
        {
          type: eventType,
          data: {
            productId: "not-found-product-id",
            customer: { email: "existing@example.com" },
          },
        } as WebhookOrderPaidPayload | WebhookSubscriptionActivePayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("Product not found")
      expect(sendAccessFailureEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        env: { POLAR_WEBHOOK_SECRET: "test" },
      })
    })
  })

  describe.each([
    "order.refunded",
    "subscription.revoked",
  ])("on '%s' event", async (eventType) => {
    it("revokes user access and returns HTTP 201", async () => {
      await grantUserRole(db, existingUserId, "pro" as unknown as Role)
      const response = await onPaymentRevoked(
        {
          type: eventType,
          data: {
            productId: "pro-preview-product-id",
            customer: { email: "existing@example.com" },
          },
        } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )
      expect(response.status).toBe(201)
      expect(
        await hasUserRole(db, existingUserId, "pro" as unknown as Role),
      ).toBe(false)
      expect(sendAccessRevokedEmail).toHaveBeenCalledWith({
        to: "existing@example.com",
        env: { POLAR_WEBHOOK_SECRET: "test" },
        productName: "Pro",
      })
    })

    it("returns HTTP 200 when user is not found", async () => {
      const response = await onPaymentRevoked(
        {
          type: eventType,
          data: {
            productId: "pro-preview-product-id",
            customer: { email: "not-found@example.com" },
          },
        } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("User not found")
      expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
    })

    it("returns HTTP 200 when product is not found", async () => {
      const response = await onPaymentRevoked(
        {
          type: eventType,
          data: {
            productId: "not-found-product-id",
            customer: { email: "existing@example.com" },
          },
        } as WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload,
        db,
        { POLAR_WEBHOOK_SECRET: "test" } as Env,
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe("Product not found")
      expect(sendAccessRevokedEmail).not.toHaveBeenCalled()
    })
  })
})
