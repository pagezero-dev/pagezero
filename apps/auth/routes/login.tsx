import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { z } from "zod"

import { authClient } from "@/auth/auth-client"
import { SignIn } from "@/auth/components/sign-in"
import { getRedirectUrl } from "@/auth/redirect"
import { getLoginPageData, requireAuthConfiguration, requireGuestUser } from "@/auth/rpc"
import { Turnstile } from "@/cloudflare/turnstile"
import { Link as UiLink } from "@/ui/link"

const loginSearchSchema = z.object({
  redirectTo: z.string().optional().catch("/"),
})

const LOGIN_EMAIL_SCHEMA = z.email()

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: async () => {
    await requireAuthConfiguration()
    await requireGuestUser()
  },
  loaderDeps: ({ search }) => ({ redirectTo: search.redirectTo ?? "/" }),
  loader: async ({ deps }) => {
    return getLoginPageData({ data: { redirectTo: deps.redirectTo } })
  },
  component: Login,
})

function getTurnstileToken() {
  const input = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')
  return input?.value || undefined
}

function Login() {
  const { cloudflareTurnstilePublicKey, redirectTo } = Route.useLoaderData()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const [isPending, setIsPending] = useState(false)
  const turnstileSubjectKey = isPending ? "pending" : "idle"

  async function withCaptchaHeaders<T>(
    run: (headers?: Record<string, string>) => Promise<T>,
  ): Promise<T> {
    const token = getTurnstileToken()
    if (!token) {
      return run()
    }
    return run({
      "x-captcha-response": token,
    })
  }

  async function onSubmitEmail(submittedEmail: string) {
    setError(undefined)
    setSuccess(undefined)

    const parsed = LOGIN_EMAIL_SCHEMA.safeParse(submittedEmail)
    if (!parsed.success) {
      setError("Invalid email address")
      return
    }

    setIsPending(true)
    try {
      const result = await withCaptchaHeaders((headers) =>
        authClient.emailOtp.sendVerificationOtp({
          email: parsed.data,
          type: "sign-in",
          fetchOptions: headers ? { headers } : undefined,
        }),
      )

      if (result.error) {
        setError(result.error.message ?? "Failed to send verification code")
        return
      }

      setEmail(parsed.data)
      setSuccess("Check your email for temporary password")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code")
    } finally {
      setIsPending(false)
    }
  }

  async function onSubmitOtp(otp: string) {
    if (!email) {
      return
    }

    setError(undefined)
    setIsPending(true)
    try {
      const result = await withCaptchaHeaders((headers) =>
        authClient.signIn.emailOtp({
          email,
          otp,
          fetchOptions: headers ? { headers } : undefined,
        }),
      )

      if (result.error) {
        const message = result.error.message ?? "Invalid verification code"
        setError(message === "Invalid OTP" ? "Invalid verification code" : message)
        return
      }

      void queryClient.invalidateQueries({ queryKey: ["user"] })
      await navigate({ to: getRedirectUrl(redirectTo) })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto mt-4 space-y-4">
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <SignIn
          isPending={isPending}
          email={email}
          error={error}
          success={success}
          onSubmitEmail={onSubmitEmail}
          onSubmitOtp={onSubmitOtp}
        />
        {cloudflareTurnstilePublicKey && (
          <Turnstile siteKey={cloudflareTurnstilePublicKey} subjectKey={turnstileSubjectKey} />
        )}
        <p>
          <UiLink size="sm" asChild className="text-muted-foreground">
            <Link to="/">Go back</Link>
          </UiLink>
        </p>
      </main>
    </div>
  )
}
