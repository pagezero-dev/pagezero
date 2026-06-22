import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { z } from "zod"
import { SignIn } from "@/auth/components/sign-in"
import {
  getLoginPageData,
  loginFormAction,
  loginFormSchema,
  requireAuthConfiguration,
  requireGuestUser,
} from "@/auth/rpc"
import { Turnstile } from "@/cloudflare/turnstile"
import { useFormAction } from "@/form"
import { Link as UiLink } from "@/ui/link"

const loginSearchSchema = z.object({
  redirectTo: z.string().optional().catch("/"),
})

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

function Login() {
  const { cloudflareTurnstilePublicKey, redirectTo } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const { data, error, isPending, onSubmit } = useFormAction(
    loginFormSchema,
    loginFormAction,
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
          isPending={isPending}
          email={email}
          error={actionError ?? error?.message}
          success={success}
          signature={signature}
          expiresAt={expiresAt}
        />
        {cloudflareTurnstilePublicKey && (
          <Turnstile
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
