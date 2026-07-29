import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader, getRequestHeaders } from "@tanstack/react-start/server"
import { env } from "cloudflare:workers"
import { z } from "zod"

import { validateTurnstile } from "@/cloudflare/turnstile"
import { parseFormData } from "@/form"

import { auth } from "../auth.server"
import { getRedirectUrl } from "../redirect"

export const loginFormSchema = z.object({
  email: z.email(),
  otp: z.string().optional(),
  redirectTo: z.string().optional(),
  "cf-turnstile-response": z.string().optional(),
})

export const getLoginPageData = createServerFn({ method: "GET" })
  .validator((data: { redirectTo: string }) => data)
  .handler(async ({ data }) => {
    return {
      cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
      redirectTo: getRedirectUrl(data.redirectTo),
    }
  })

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message === "Invalid OTP" ? "Invalid verification code" : error.message
  }
  return fallback
}

export const loginFormAction = createServerFn({ method: "POST" })
  .validator((data: FormData) => parseFormData(loginFormSchema, data))
  .handler(async ({ data }) => {
    const { email, otp, redirectTo, "cf-turnstile-response": turnstileResponse } = data

    const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (cloudflareTurnstileSecretKey) {
      const ip = getRequestHeader("CF-Connecting-IP")
      const isHuman = await validateTurnstile({
        secret: cloudflareTurnstileSecretKey,
        token: turnstileResponse,
        ip,
      })

      if (!isHuman) {
        throw new Error("Human verification failed")
      }
    }

    const headers = getRequestHeaders()

    if (!otp) {
      try {
        await auth.api.sendVerificationOTP({
          body: {
            email,
            type: "sign-in",
          },
          headers,
        })
      } catch (error) {
        throw new Error(getAuthErrorMessage(error, "Failed to send an email"), { cause: error })
      }

      return {
        email,
        success: "Check your email for temporary password",
      }
    }

    try {
      await auth.api.signInEmailOTP({
        body: {
          email,
          otp,
        },
        headers,
      })
    } catch (error) {
      return {
        error: getAuthErrorMessage(error, "Invalid verification code"),
        email,
      }
    }

    throw redirect({ to: getRedirectUrl(redirectTo) })
  })
