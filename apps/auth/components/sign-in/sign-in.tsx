import { AlertTriangleIcon, InfoIcon, LockIcon } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { Alert, AlertDescription } from "@/ui/alert"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Heading, Muted } from "@/ui/typography"

interface SignInProps {
  email?: string
  error?: string
  success?: string
  signature?: string
  expiresAt?: number
}

export const SignIn = ({
  email,
  error,
  success,
  signature,
  expiresAt,
}: SignInProps) => {
  const [otp, setOtp] = useState("")
  const emailInputId = useId()
  const otpInputId = useId()

  // biome-ignore lint/correctness/useExhaustiveDependencies: executing effect on error, email change is expected
  useEffect(() => {
    setOtp("")
  }, [error, email])

  return (
    <div className="w-full max-w-xs space-y-10">
      <div className="text-center">
        <LockIcon className="mx-auto size-8" />
        <Heading level={2} className="text-center">
          {email ? "Verify email" : "Sign in"}
        </Heading>
        <Muted>
          {email
            ? "Enter the verification code sent to your email"
            : "Enter your email to obtain a temporary password"}
        </Muted>
      </div>

      <div className="space-y-4">
        {signature && (
          <input type="hidden" name="signature" value={signature} />
        )}
        {expiresAt && (
          <input type="hidden" name="expiresAt" value={expiresAt} />
        )}
        {email && <input type="hidden" name="email" value={email} />}

        {error && (
          <Alert variant="destructive">
            <AlertTriangleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <InfoIcon />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {!email && (
          <div className="space-y-3">
            <Label htmlFor={emailInputId}>Email</Label>
            <Input
              type="email"
              id={emailInputId}
              name="email"
              placeholder="Enter your email"
            />
          </div>
        )}

        {email && (
          <div className="space-y-3">
            <Label htmlFor={otpInputId}>Verification code</Label>
            <Input
              type="text"
              id={otpInputId}
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter verification code"
            />
          </div>
        )}
      </div>

      <div>
        <Button type="submit" className="w-full">
          {email ? "Verify" : "Login"}
        </Button>
      </div>
    </div>
  )
}
