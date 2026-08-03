import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, emailOTP } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { env } from "cloudflare:workers"

import config from "@/config"
import { getMainDb } from "@/db/main"
import * as schema from "@/db/main/schema"
import { sendAuthOtpEmail } from "@/email/templates.server"
import { createPolarPlugins } from "@/payments/better-auth.server"

import { ac, admin as adminRole, elite, premium, user } from "./access"

export const auth = betterAuth({
  database: drizzleAdapter(getMainDb(), {
    provider: "sqlite",
    schema,
  }),
  baseURL: {
    allowedHosts: ["localhost:*", "*.workers.dev", new URL(config.core.websiteUrl).host],
  },
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
