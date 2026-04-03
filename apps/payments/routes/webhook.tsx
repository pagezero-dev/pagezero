import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
import { data } from "react-router"
import { envContext } from "@/core/context"
import { onPaymentRevoked, onPaymentSuccess } from "../handlers.server"
import type { WebhookEvents } from "../types"
import type { Route } from "./+types/webhook"

export const loader = async () => {
  throw data({ error: "Webhook does not handle GET requests" }, { status: 404 })
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const env = context.get(envContext)
    if (!env.POLAR_WEBHOOK_SECRET) {
      throw new Error("The Polar webhook secret is not set")
    }

    const payload = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    let event: WebhookEvents

    event = validateEvent(payload, headers, env.POLAR_WEBHOOK_SECRET)

    switch (event.type) {
      case "order.paid":
      case "subscription.active":
        return onPaymentSuccess(event, context)
      case "order.refunded":
      case "subscription.revoked":
        return onPaymentRevoked(event, context)
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
