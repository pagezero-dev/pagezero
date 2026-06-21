import { AlertTriangleIcon, InfoIcon, Loader2, Mail } from "lucide-react"
import { Turnstile } from "@/cloudflare/turnstile"
import { useFormAction } from "@/form"
import { Alert, AlertDescription } from "@/ui/alert"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { cn } from "@/ui/utils"
import { subscribeFormAction, subscribeFormSchema } from "../../rpc/subscribe"

export interface NewsletterSignupProps {
  cloudflareTurnstilePublicKey?: string
  className?: string
}

export function NewsletterSignup({
  cloudflareTurnstilePublicKey,
  className,
}: NewsletterSignupProps) {
  const { data, error, isPending, onSubmit } = useFormAction(
    subscribeFormSchema,
    subscribeFormAction,
  )
  const success = data?.success
  const turnstileSubjectKey = isPending ? "pending" : "idle"

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-2", className)}
    >
      {error?.message && (
        <Alert variant="destructive">
          <AlertTriangleIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <InfoIcon />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {cloudflareTurnstilePublicKey ? (
        <Turnstile
          siteKey={cloudflareTurnstilePublicKey}
          subjectKey={turnstileSubjectKey}
        />
      ) : null}

      {!success ? (
        <div className="flex gap-2">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Subscribe
          </Button>
        </div>
      ) : null}
    </form>
  )
}
