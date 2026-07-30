import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { APIError, createAuthEndpoint } from "better-auth/api"
import { env } from "cloudflare:workers"

import config from "@/config"

import { onPaymentRevoked, onPaymentSuccess } from "./handlers.server"

export const POLAR_NOT_CONFIGURED_MESSAGE =
  "Polar is not configured. Set POLAR_ACCESS_TOKEN to enable payments."

function getPolarProducts() {
  const mode = import.meta.env.PROD ? "production" : "preview"
  return Object.entries(config.payments.products).map(([slug, product]) => ({
    productId: product.polarProductId[mode],
    slug,
  }))
}

function createPolarNotConfiguredPlugin() {
  return {
    id: "polar-not-configured",
    endpoints: {
      checkout: createAuthEndpoint("/checkout", { method: "POST" }, async () => {
        throw new APIError("BAD_REQUEST", {
          message: POLAR_NOT_CONFIGURED_MESSAGE,
        })
      }),
    },
  }
}

export function createPolarPlugins() {
  const accessToken = env.POLAR_ACCESS_TOKEN
  if (!accessToken) {
    return [createPolarNotConfiguredPlugin()]
  }

  const polarClient = new Polar({
    accessToken,
    server: import.meta.env.PROD ? "production" : "sandbox",
  })

  const checkoutPlugin = checkout({
    products: getPolarProducts(),
    successUrl: "/payments/success?checkout_id={CHECKOUT_ID}",
    authenticatedUsersOnly: false,
  })
  const portalPlugin = portal()
  const webhookPlugin = env.POLAR_WEBHOOK_SECRET
    ? webhooks({
        secret: env.POLAR_WEBHOOK_SECRET,
        onOrderPaid: onPaymentSuccess,
        onSubscriptionActive: onPaymentSuccess,
        onOrderRefunded: onPaymentRevoked,
        onSubscriptionRevoked: onPaymentRevoked,
      })
    : null

  return [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: webhookPlugin
        ? [checkoutPlugin, portalPlugin, webhookPlugin]
        : [checkoutPlugin, portalPlugin],
    }),
  ]
}
