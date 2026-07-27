import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { env } from "cloudflare:workers"

import { auth } from "../auth.server"
import { getRedirectUrl } from "../redirect"

export type UserData = {
  user: { id: string; email: string; name: string; role?: string | null } | null
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (session?.user) {
    const user = session.user as typeof session.user & { role?: string | null }
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    } satisfies UserData
  }

  return { user: null } satisfies UserData
})

export const getLoginPageData = createServerFn({ method: "GET" })
  .validator((data: { redirectTo: string }) => data)
  .handler(async ({ data }) => {
    return {
      cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
      redirectTo: getRedirectUrl(data.redirectTo),
    }
  })
