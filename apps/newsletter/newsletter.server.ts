import { sign, verify } from "@/crypto"

export type NewsletterConfirmationPayload = {
  email: string
  expiresAt: number
}

export async function signConfirmation(
  secret: string,
  { email, expiresAt }: NewsletterConfirmationPayload,
) {
  const data = JSON.stringify({ email, expiresAt })
  return sign(secret, data)
}

export async function verifyConfirmation(
  secret: string,
  { email, expiresAt }: NewsletterConfirmationPayload,
  signature: string,
) {
  const data = JSON.stringify({ email, expiresAt })
  return verify(secret, data, signature)
}

export function generateExpiration(minutesOffset: number = 30) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutesOffset)
  return now.getTime()
}

export function isExpired(expiresAt: number) {
  return Date.now() > expiresAt
}

export function buildConfirmUrl(
  baseUrl: string,
  {
    email,
    expiresAt,
    signature,
  }: NewsletterConfirmationPayload & { signature: string },
) {
  const url = new URL("/newsletter/confirm", baseUrl)
  url.searchParams.set("email", email)
  url.searchParams.set("expiresAt", String(expiresAt))
  url.searchParams.set("signature", signature)
  return url.toString()
}
