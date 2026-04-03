import { envContext } from "@/core/context"
import type { MiddlewareArgs } from "@/types/router"
import { authContext } from "./context"
import { createSessionStorage } from "./session.server"

export async function authMiddleware({ request, context }: MiddlewareArgs) {
  const env = context.get(envContext)
  const { getSession, commitSession, destroySession } = createSessionStorage(
    env.SESSION_COOKIE_SECRET,
  )
  const session = await getSession(request.headers.get("Cookie"))
  context.set(authContext, {
    session,
    commitSession,
    destroySession,
  })
}
