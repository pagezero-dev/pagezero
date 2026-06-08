import { useQueryClient } from "@tanstack/react-query"
import {
  createFileRoute,
  isRedirect,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { z } from "zod"
import {
  generateOTP,
  generateOTPExpiration,
  getRedirectUrl,
  isOTPExpired,
  signOtp,
  verifyHuman,
  verifyOtp,
} from "@/auth"
import { SignIn } from "@/auth/components/sign-in"
import { VerifyHuman } from "@/auth/components/verify-human"
import { Link as UiLink } from "@/ui/link"
import { getOrCreateUserByEmail, getUserId, isValidUserId } from "@/user"

type LoginActionData = {
  email?: string
  signature?: string
  expiresAt?: number
  error?: string
  success?: string
}

const UserEmailSchema = z.object({
  email: z.email(),
})

const loginInputSchema = z.object({
  email: z.string(),
  otp: z.string().optional(),
  redirectTo: z.string().optional(),
  signature: z.string().optional(),
  expiresAt: z.number().optional(),
  turnstileToken: z.string().optional(),
})

const ensureGuest = createServerFn({ method: "GET" }).handler(async () => {
  const { useAppSession } = await import("@/auth/session.server")
  const { getDb } = await import("@/core/db.server")
  const session = await useAppSession()
  const db = getDb()
  const userId = await getUserId(session)

  if (userId && (await isValidUserId(db, userId))) {
    throw redirect({ to: "/" })
  }
})

const getLoginPageData = createServerFn({ method: "GET" })
  .validator((data: { redirectTo: string }) => data)
  .handler(async ({ data }) => {
    const { getEnv } = await import("@/core/db.server")
    const env = getEnv()
    return {
      cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
      redirectTo: getRedirectUrl(data.redirectTo),
    }
  })

const loginAction = createServerFn({ method: "POST" })
  .validator(loginInputSchema)
  .handler(async ({ data }): Promise<LoginActionData | never> => {
    const { updateAppSession } = await import("@/auth/session.server")
    const { getDb, getEnv } = await import("@/core/db.server")
    const env = getEnv()
    const db = getDb()

    if (!env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not set")
    }

    const { email, otp, redirectTo, signature, expiresAt, turnstileToken } =
      data

    if (!email) {
      return { error: "Email is required" }
    }

    const emailParseResult = UserEmailSchema.safeParse({ email })
    if (emailParseResult.error) {
      return {
        error: z.flattenError(emailParseResult.error).fieldErrors.email?.[0],
      }
    }

    const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (cloudflareTurnstileSecretKey) {
      const { getRequestHeader } = await import("@tanstack/react-start/server")
      const ip = getRequestHeader("CF-Connecting-IP")
      const isHuman = await verifyHuman({
        secret: cloudflareTurnstileSecretKey,
        token: turnstileToken,
        ip,
      })

      if (!isHuman) {
        return { error: "Human verification failed" }
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
        const { sendAuthOtpEmail } = await import("@/email/templates.server")
        await sendAuthOtpEmail({ to: email, otp: generatedOtp, env })
      } catch {
        return { error: "Failed to send an email" }
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
      return { error: "Verification code expired" }
    }

    const user = await getOrCreateUserByEmail(db, email)
    await updateAppSession({ userId: `${user.id}` })

    throw redirect({ href: getRedirectUrl(redirectTo) })
  })

const loginSearchSchema = z.object({
  redirectTo: z.string().optional().catch("/"),
})

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: async () => {
    await ensureGuest()
  },
  loaderDeps: ({ search }) => ({ redirectTo: search.redirectTo ?? "/" }),
  loader: async ({ deps }) => {
    return getLoginPageData({ data: { redirectTo: deps.redirectTo } })
  },
  component: Login,
})

function Login() {
  const { cloudflareTurnstilePublicKey, redirectTo } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [actionData, setActionData] = useState<LoginActionData>()
  const [isPending, setIsPending] = useState(false)
  const { email, error, success, signature, expiresAt } = actionData || {}
  const turnstileSubjectKey = isPending ? "pending" : "idle"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const emailValue = formData.get("email")?.toString() ?? ""
    const turnstileToken = formData.get("cf-turnstile-response")?.toString()

    if (!emailValue && !formData.get("otp")?.toString()) {
      setActionData({ error: "Email is required" })
      setIsPending(false)
      return
    }

    try {
      const result = await loginAction({
        data: {
          email: emailValue,
          otp: formData.get("otp")?.toString(),
          redirectTo: formData.get("redirectTo")?.toString(),
          signature: formData.get("signature")?.toString(),
          expiresAt: Number(formData.get("expiresAt")?.toString()) || undefined,
          turnstileToken,
        },
      })
      setActionData(result)
    } catch (error) {
      if (isRedirect(error)) {
        await queryClient.invalidateQueries({ queryKey: ["user"] })
        await router.navigate(error.options)
        return
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="container mx-auto mt-4 space-y-4"
    >
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <SignIn
          email={email}
          error={error}
          success={success}
          signature={signature}
          expiresAt={expiresAt}
        />
        {cloudflareTurnstilePublicKey && (
          <VerifyHuman
            siteKey={cloudflareTurnstilePublicKey}
            subjectKey={turnstileSubjectKey}
          />
        )}
        <p>
          <UiLink size="sm" asChild className="text-muted-foreground">
            <Link to="/">Go back</Link>
          </UiLink>
        </p>
      </main>
    </form>
  )
}
