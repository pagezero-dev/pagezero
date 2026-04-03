import { validateEvent } from "@polar-sh/sdk/webhooks"
import config from "@/config"
import type { Role } from "@/permissions"

export type WebhookEvents = ReturnType<typeof validateEvent>

export type WebhookOrderPaidPayload = Extract<
  WebhookEvents,
  { type: "order.paid" }
>
export type WebhookSubscriptionActivePayload = Extract<
  WebhookEvents,
  { type: "subscription.active" }
>
export type WebhookOrderRefundedPayload = Extract<
  WebhookEvents,
  { type: "order.refunded" }
>
export type WebhookSubscriptionRevokedPayload = Extract<
  WebhookEvents,
  { type: "subscription.revoked" }
>

export type PaymentsConfig = {
  payments: {
    products: Record<
      string,
      {
        name: string
        userRoleToGrant: Role
        polarProductId: {
          preview: string
          production: string
        }
        checkoutLink: {
          preview: string
          production: string
        }
      }
    >
  }
}

export type Product = keyof (typeof config)["payments"]["products"]
