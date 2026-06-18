import { env } from "cloudflare:workers"
import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Resend } from "resend"
import { z } from "zod"
import { verify } from "@/crypto"
import { parseFormData } from "@/form"
import { isExpired } from "../newsletter.server"

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
      return { error: "Invalid confirmation link" }
    }

    if (isExpired(expiresAt)) {
      return { error: "This confirmation link has expired" }
    }

    if (!env.RESEND_API_KEY) {
      throw new Error("Newsletter signup is not configured")
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
        throw new Error(
          "Could not complete subscription. Please try again later.",
        )
      }
    }

    const segmentId = env.NEWSLETTER_SEGMENT_ID?.trim()
    if (segmentId) {
      const { error: segmentError } = await resend.contacts.segments.add({
        email,
        segmentId,
      })
      if (segmentError) {
        const message = segmentError.message.toLowerCase()
        const isBenign =
          message.includes("already") ||
          message.includes("duplicate") ||
          message.includes("exists")
        if (!isBenign) {
          throw new Error(
            "Could not complete subscription. Please try again later.",
          )
        }
      }
    }

    return {
      success: "You're subscribed to the newsletter. Thank you.",
    }
  })
