import { redirect } from "@tanstack/react-router"
import { getRequestUrl } from "@tanstack/react-start/server"
import { sign, verify } from "@/crypto"
import { getUserId } from "@/user"
import { useAppSession } from "./session.server"

const LOGIN_ROUTE = "/login"

type OTPPayload = {
  email: string
  otp: string
  expiresAt: number
}

export async function requireUserId({
  redirectTo,
}: {
  redirectTo?: string
} = {}) {
  const session = await useAppSession()
  const userID = await getUserId(session)
  if (!userID) {
    const requestURLObject = getRequestUrl()
    const redirectToURL =
      redirectTo ?? `${requestURLObject.pathname}${requestURLObject.search}`
    const redirectURL = redirectToURL
      ? `${LOGIN_ROUTE}?redirectTo=${redirectToURL}`
      : LOGIN_ROUTE
    throw redirect({ href: redirectURL })
  }
  return userID
}

export function getRedirectUrl(redirectTo: string = "/") {
  const requestURLObject = new URL(redirectTo, "https://base")
  return requestURLObject.pathname + requestURLObject.search
}

export async function signOtp(
  secret: string,
  { email, otp, expiresAt }: OTPPayload,
) {
  const data = JSON.stringify({ email, otp, expiresAt })
  const signature = await sign(secret, data)
  return signature
}

export async function verifyOtp(
  secret: string,
  { email, otp, expiresAt }: OTPPayload,
  signature: string,
) {
  const data = JSON.stringify({ email, otp, expiresAt })
  const isValid = await verify(secret, data, signature)
  return isValid
}

export function generateOTP() {
  // creates a typed array that can hold a single 32-bit unsigned integer
  const array = new Uint32Array(1)
  // fills this array with cryptographically strong random values using the Web Crypto API
  crypto.getRandomValues(array)
  // apply modulo to generate a number between 0-999999 (6 digits at most)
  const otp = array[0] % 1000000
  // convert to string and ensure it's exactly 6 digits by padding with leading zeros if needed
  return otp.toString().padStart(6, "0")
}

export function generateOTPExpiration(minutesOffset: number = 5) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutesOffset)
  return now.getTime()
}

export function isOTPExpired(expiresAt: number) {
  const now = new Date()
  return now.getTime() > expiresAt
}

export async function verifyHuman({
  secret,
  token,
  ip,
}: {
  secret: string
  token?: string
  ip?: string | null
}) {
  const body = new FormData()
  body.append("secret", secret)
  body.append("response", token ?? "")
  body.append("remoteip", ip ?? "")

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  )

  const outcome = await result.json<{ success: boolean }>()
  if (outcome.success) {
    return true
  }
  return false
}
