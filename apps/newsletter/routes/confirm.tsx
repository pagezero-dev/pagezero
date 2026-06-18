import { createFileRoute, Link } from "@tanstack/react-router"
import { AlertTriangleIcon, CircleCheck, Loader2, MailIcon } from "lucide-react"
import { z } from "zod"
import { useFormAction } from "@/form"
import { Alert, AlertDescription } from "@/ui/alert"
import { Button } from "@/ui/button"
import { Link as UiLink } from "@/ui/link"
import { Heading, Muted } from "@/ui/typography"
import {
  confirmFormAction,
  confirmFormSchema,
  getConfirmPageData,
} from "../rpc"

const confirmSearchSchema = z.object({
  email: z.string().catch(""),
  expiresAt: z.coerce.number().catch(0),
  signature: z.string().catch(""),
})

export const Route = createFileRoute("/newsletter/confirm")({
  validateSearch: (search) => confirmSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    email: search.email,
    expiresAt: search.expiresAt,
    signature: search.signature,
  }),
  loader: async ({ deps }) => getConfirmPageData({ data: deps }),
  component: Confirm,
})

function Confirm() {
  const loaderData = Route.useLoaderData()
  const { data, error, isPending, onSubmit } = useFormAction(
    confirmFormAction,
    confirmFormSchema,
  )
  const isValidLink = loaderData.isValidLink
  const email = isValidLink ? loaderData.email : undefined
  const expiresAt = isValidLink ? loaderData.expiresAt : undefined
  const signature = isValidLink ? loaderData.signature : undefined
  const loaderError = isValidLink ? undefined : loaderData.error
  const actionError = data && "error" in data ? data.error : undefined
  const success = data && "success" in data ? data.success : undefined
  const displayError = actionError ?? loaderError ?? error?.message

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-4"
    >
      <div className="max-w-md space-y-6 text-center">
        <MailIcon className="mx-auto size-10" />
        <div>
          <Heading level={2}>Newsletter</Heading>
          <Muted>Confirm your email address to subscribe:</Muted>
          {isValidLink && email && <Muted className="font-bold">{email}</Muted>}
        </div>

        {displayError && (
          <Alert variant="destructive">
            <AlertTriangleIcon />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CircleCheck />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {!success && (
          <div className="space-y-4">
            <input type="hidden" name="email" value={email ?? ""} />
            <input type="hidden" name="expiresAt" value={expiresAt ?? ""} />
            <input type="hidden" name="signature" value={signature ?? ""} />
            <Button type="submit" disabled={!isValidLink || isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Confirm subscription
            </Button>
          </div>
        )}

        <p>
          <UiLink size="sm" asChild className="text-muted-foreground">
            <Link to="/">Back to home</Link>
          </UiLink>
        </p>
      </div>
    </form>
  )
}
