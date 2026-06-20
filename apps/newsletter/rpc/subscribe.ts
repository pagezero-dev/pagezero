import { env } from "cloudflare:workers"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { z } from "zod"
import { validateTurnstile } from "@/cloudflare/turnstile"
import config from "@/config"
import { sign } from "@/crypto"
import { expiresInMinutes } from "@/date"
import { sendNewsletterConfirmEmail } from "@/email/templates.server"
import { parseFormData } from "@/form"
import { buildConfirmUrl } from "../newsletter.server"

export const subscribeFormSchema = z.object({
  email: z.email(),
  "cf-turnstile-response": z.string().optional(),
})

export const subscribeFormAction = createServerFn({ method: "POST" })
  .validator((data: FormData) => parseFormData(data, subscribeFormSchema))
  .handler(async ({ data }) => {
    if (!env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not set")
    }

    const { email, "cf-turnstile-response": turnstileResponse } = data

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

    const expiresAt = expiresInMinutes(30)
    const signature = await sign(env.OTP_SECRET, { email, expiresAt })
    const confirmUrl = buildConfirmUrl(config.core.websiteUrl, {
      email,
      expiresAt,
      signature,
    })

    try {
      await sendNewsletterConfirmEmail({ to: email, confirmUrl })
    } catch {
      throw new Error("Failed to send confirmation email")
    }

    return {
      success: "Check your email to confirm your subscription",
    }
  })
