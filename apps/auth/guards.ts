import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"
import { getUserId, isValidUserId } from "@/user"
import { useAppSession } from "./session.server"

const LOGIN_ROUTE = "/login"

export const requireUserId = createServerFn({ method: "GET" })
  .validator((data?: { redirectTo?: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    const userID = await getUserId(session)
    if (!userID) {
      const requestURLObject = getRequestUrl()
      const redirectToURL =
        data?.redirectTo ??
        `${requestURLObject.pathname}${requestURLObject.search}`
      throw redirect(
        redirectToURL
          ? { to: LOGIN_ROUTE, search: { redirectTo: redirectToURL } }
          : { to: LOGIN_ROUTE },
      )
    }
    return userID
  })

export const requireGuestUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession()
    const userId = await getUserId(session)

    if (userId && (await isValidUserId(userId))) {
      throw redirect({ to: "/" })
    }
  },
)
