import { env } from "cloudflare:workers"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { z } from "zod"
import { validateTurnstile } from "@/cloudflare/turnstile"
import { sendAuthOtpEmail } from "@/email/templates.server"
import { parseFormData } from "@/form"
import {
  generateOTP,
  generateOTPExpiration,
  getRedirectUrl,
  isOTPExpired,
  signOtp,
  verifyOtp,
} from "../auth.server"
import { updateAppSession } from "../session.server"
import { getOrCreateUserByEmail } from "../user.server"

export const loginFormSchema = z.object({
  email: z.email(),
  otp: z.string().optional(),
  redirectTo: z.string().optional(),
  signature: z.string().optional(),
  expiresAt: z.coerce.number().optional(),
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

export const loginFormAction = createServerFn({ method: "POST" })
  .validator((data: FormData) => parseFormData(data, loginFormSchema))
  .handler(async ({ data }) => {
    if (!env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not set")
    }

    const {
      email,
      otp,
      redirectTo,
      signature,
      expiresAt,
      "cf-turnstile-response": turnstileResponse,
    } = data

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

    if (!otp) {
      const generatedOtp = generateOTP()
      const generatedExpiresAt = generateOTPExpiration()
      const generatedSignature = await signOtp(env.OTP_SECRET, {
        email,
        otp: generatedOtp,
        expiresAt: generatedExpiresAt,
      })
      try {
        await sendAuthOtpEmail({ to: email, otp: generatedOtp })
      } catch {
        throw new Error("Failed to send an email")
      }

      return {
        email,
        signature: generatedSignature,
        expiresAt: generatedExpiresAt,
        success: "Check your email for temporary password",
      }
    }

    const isValid = await verifyOtp(
      env.OTP_SECRET,
      {
        email,
        otp,
        expiresAt: expiresAt ?? 0,
      },
      signature ?? "",
    )

    if (!isValid) {
      return {
        error: "Invalid verification code",
        email,
        signature,
        expiresAt,
      }
    }

    if (isOTPExpired(expiresAt ?? 0)) {
      throw new Error("Verification code expired")
    }

    const user = await getOrCreateUserByEmail(email)
    await updateAppSession({ userId: `${user.id}` })

    throw redirect({ to: getRedirectUrl(redirectTo) })
  })
