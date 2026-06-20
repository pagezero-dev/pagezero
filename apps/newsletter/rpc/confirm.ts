import { env } from "cloudflare:workers"
import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Resend } from "resend"
import { z } from "zod"
import { verify } from "@/crypto"
import { isExpired } from "@/date"
import { parseFormData } from "@/form"

export const confirmFormSchema = z.object({
  email: z.email(),
  expiresAt: z.coerce.number(),
  signature: z.string(),
})

export const getConfirmPageData = createServerFn({ method: "GET" })
  .validator(confirmFormSchema)
  .handler(async ({ data }) => {
    if (!env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not set")
    }

    const { email, expiresAt, signature } = data
    const isValidLink = await verify(
      env.OTP_SECRET,
      { email, expiresAt },
      signature,
    )

    if (!isValidLink) {
      throw notFound()
    }

    return {
      email,
      expiresAt,
      signature,
    }
  })

export const confirmFormAction = createServerFn({ method: "POST" })
  .validator((data: FormData) => parseFormData(data, confirmFormSchema))
  .handler(async ({ data }) => {
    if (!env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not set")
    }

    const { email, expiresAt, signature } = data

    const isValid = await verify(
      env.OTP_SECRET,
      { email, expiresAt },
      signature,
    )
    if (!isValid) {
      throw new Error("Invalid confirmation link")
    }

    if (isExpired(expiresAt)) {
      throw new Error("Confirmation link has expired")
    }

    if (!env.RESEND_API_KEY) {
      throw new Error("Newsletter signup is not configured")
    }

    if (!env.NEWSLETTER_SEGMENT_ID) {
      throw new Error("Newsletter segment is not configured")
    }

    const resend = new Resend(env.RESEND_API_KEY)
    const { error: createError } = await resend.contacts.create({
      email,
      unsubscribed: false,
    })

    if (createError) {
      const message = createError.message.toLowerCase()
      const isDuplicate =
        message.includes("already") ||
        message.includes("duplicate") ||
        message.includes("exists")
      if (!isDuplicate) {
        throw createError
      }
    }

    const { error: segmentError } = await resend.contacts.segments.add({
      email,
      segmentId: env.NEWSLETTER_SEGMENT_ID,
    })
    if (segmentError) {
      const message = segmentError.message.toLowerCase()
      const isBenign =
        message.includes("already") ||
        message.includes("duplicate") ||
        message.includes("exists")
      if (!isBenign) {
        throw segmentError
      }
    }

    return {
      success: "You're subscribed to the newsletter. Thank you.",
    }
  })
