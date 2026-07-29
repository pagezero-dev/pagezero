import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError, createAuthEndpoint } from "better-auth/api"
import { admin, captcha, emailOTP } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { env } from "cloudflare:workers"

import config from "@/config"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { sendAuthOtpEmail } from "@/email/templates.server"
import { onPaymentRevoked, onPaymentSuccess } from "@/payments/handlers.server"

import { ac, admin as adminRole, elite, premium, user } from "./access"

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

function createPolarPlugins() {
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

export const auth = betterAuth({
  database: drizzleAdapter(getMainDb(), {
    provider: "sqlite",
    schema,
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await sendAuthOtpEmail({ to: email, otp })
        }
      },
    }),
    ...(env.CLOUDFLARE_TURNSTILE_SECRET_KEY
      ? [
          captcha({
            provider: "cloudflare-turnstile",
            secretKey: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
            endpoints: ["/email-otp/send-verification-otp", "/sign-in/email-otp"],
          }),
        ]
      : []),
    admin({
      ac,
      roles: {
        admin: adminRole,
        user,
        premium,
        elite,
      },
    }),
    ...createPolarPlugins(),
    tanstackStartCookies(),
  ],
})

export type Auth = typeof auth
