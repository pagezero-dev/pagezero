import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
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
import { parseFormData, useFormAction } from "@/form"
import { Link as UiLink } from "@/ui/link"
import { getOrCreateUserByEmail, getUserId, isValidUserId } from "@/user"

const loginFormSchema = z.object({
  email: z.email(),
  otp: z.string().optional(),
  redirectTo: z.string().optional(),
  signature: z.string().optional(),
  expiresAt: z.coerce.number().optional(),
  "cf-turnstile-response": z.string().optional(),
})

const ensureGuest = createServerFn({ method: "GET" }).handler(async () => {
  const { useAppSession } = await import("@/auth/session.server")
  const { getDb } = await import("@/db")
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
    const { env } = await import("cloudflare:workers")
    return {
      cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
      redirectTo: getRedirectUrl(data.redirectTo),
    }
  })

const loginFormAction = createServerFn({ method: "POST" })
  .validator((data: FormData) => parseFormData(data, loginFormSchema))
  .handler(async ({ data }) => {
    const { updateAppSession } = await import("@/auth/session.server")
    const [{ getDb }, { env }] = await Promise.all([
      import("@/db"),
      import("cloudflare:workers"),
    ])
    const db = getDb()

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
      const { getRequestHeader } = await import("@tanstack/react-start/server")
      const ip = getRequestHeader("CF-Connecting-IP")
      const isHuman = await verifyHuman({
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
        const { sendAuthOtpEmail } = await import("@/email/templates.server")
        await sendAuthOtpEmail({ to: email, otp: generatedOtp, env })
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

    const user = await getOrCreateUserByEmail(db, email)
    await updateAppSession({ userId: `${user.id}` })

    throw redirect({ to: getRedirectUrl(redirectTo) })
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
  const { data, error, isPending, onSubmit } = useFormAction(
    loginFormAction,
    loginFormSchema,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["user"] })
      },
    },
  )
  const {
    email,
    success,
    signature,
    expiresAt,
    error: actionError,
  } = data ?? {}
  const turnstileSubjectKey = isPending ? "pending" : "idle"

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="container mx-auto mt-4 space-y-4"
    >
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <SignIn
          email={email}
          error={actionError ?? error?.message}
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
