import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
import { createFileRoute } from "@tanstack/react-router"
import { getDb, getEnv } from "@/core/db.server"
import { onPaymentRevoked, onPaymentSuccess } from "../handlers.server"
import type { WebhookEvents } from "../types"

export const Route = createFileRoute("/payments/webhook")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          { error: "Webhook does not handle GET requests" },
          { status: 404 },
        )
      },
      POST: async ({ request }) => {
        try {
          const env = getEnv()
          if (!env.POLAR_WEBHOOK_SECRET) {
            throw new Error("The Polar webhook secret is not set")
          }

          const payload = await request.text()
          const headers = Object.fromEntries(request.headers.entries())
          const db = getDb()

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
      },
    },
  },
})
