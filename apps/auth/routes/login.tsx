import {
  data,
  Form,
  Link as RouterLink,
  redirect,
  useNavigation,
} from "react-router"
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
import { envContext } from "@/core/context"
import { dbContext } from "@/db/context"
import { sendAuthOtpEmail } from "@/email/templates.server"
import { Link } from "@/ui/link"
import { getOrCreateUserByEmail, getUserId, isValidUserId } from "@/user"
import { authContext } from "../context"
import type { Route } from "./+types/login"

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.get(envContext)
  const db = context.get(dbContext)
  const { session } = context.get(authContext)
  const userId = await getUserId(session)
  const url = new URL(request.url)

  if (userId && (await isValidUserId(db, userId))) {
    return redirect("/")
  }

  return {
    cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
    redirectTo: getRedirectUrl(url.searchParams.get("redirectTo") || "/"),
  }
}

type ActionData = {
  email?: string
  signature?: string
  expiresAt?: number
  error?: string
  success?: string
}

const UserEmailSchema = z.object({
  email: z.email(),
})

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.get(envContext)
  const db = context.get(dbContext)
  const { session, commitSession } = context.get(authContext)
  if (!env.OTP_SECRET) {
    throw new Error("OTP_SECRET is not set")
  }

  const form = await request.formData()
  const email = form.get("email")?.toString()
  const otp = form.get("otp")?.toString()
  const redirectTo = form.get("redirectTo")?.toString()

  // Step 1: Verify that the user has provided an email address
  if (!email) {
    return data<ActionData>({ error: "Email is required" }, { status: 401 })
  }

  const emailParseResult = UserEmailSchema.safeParse({ email })
  if (emailParseResult.error) {
    return data<ActionData>(
      { error: z.flattenError(emailParseResult.error).fieldErrors.email?.[0] },
      { status: 401 },
    )
  }

  // Step 2: Verify that the user is human (optional)
  const cloudflareTurnstileToken = form.get("cf-turnstile-response")?.toString()
  const ip = request.headers.get("CF-Connecting-IP")
  const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY

  if (cloudflareTurnstileSecretKey) {
    const isHuman = await verifyHuman({
      secret: cloudflareTurnstileSecretKey,
      token: cloudflareTurnstileToken,
      ip,
    })

    if (!isHuman) {
      return Response.json(
        { error: "Human verification failed" } satisfies ActionData,
        { status: 403 },
      )
    }
  }

  // Step 3: If no OTP is provided, generate a new one and send it to the user's email
  if (!otp) {
    const otp = generateOTP()
    const expiresAt = generateOTPExpiration()
    const signature = await signOtp(env.OTP_SECRET, {
      email,
      otp,
      expiresAt,
    })
    try {
      await sendAuthOtpEmail({ to: email, otp, env })
    } catch {
      return data<ActionData>(
        {
          error: "Failed to send an email",
        },
        { status: 500 },
      )
    }

    return data<ActionData>({
      email,
      signature,
      expiresAt,
      success: "Check your email for temporary password",
    })
  }

  // Step 4: Verify the OTP
  const signature = form.get("signature")?.toString() || ""
  const expiresAt = Number(form.get("expiresAt")?.toString()) || 0

  const isValid = await verifyOtp(
    env.OTP_SECRET,
    {
      email,
      otp,
      expiresAt,
    },
    signature,
  )

  if (!isValid) {
    return data<ActionData>(
      {
        error: "Invalid verification code",
        email,
        signature,
        expiresAt,
      },
      { status: 401 },
    )
  }

  if (isOTPExpired(expiresAt)) {
    return data<ActionData>(
      { error: "Verification code expired" },
      { status: 401 },
    )
  }

  // Step 5: If the OTP is valid, set the user's session and redirect to the home page
  const user = await getOrCreateUserByEmail(db, email)

  session.set("userId", `${user.id}`)

  return redirect(getRedirectUrl(redirectTo), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

export default function Login({
  loaderData: { cloudflareTurnstilePublicKey, redirectTo },
  actionData,
}: Route.ComponentProps) {
  const { email, error, success, signature, expiresAt } = actionData || {}
  const navigation = useNavigation()
  const turnstileSubjectKey = navigation.state === "idle" ? "idle" : "pending"

  return (
    <Form method="post" className="container mx-auto mt-4 space-y-4">
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
          <Link size="sm" asChild className="text-muted-foreground">
            <RouterLink to="/">Go back</RouterLink>
          </Link>
        </p>
      </main>
    </Form>
  )
}
