import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { getRequestUrl } from "@tanstack/react-start/server"
import { env } from "cloudflare:workers"

import type { ContentPermission } from "../access"
import { auth } from "../auth.server"
import { isValidUserId } from "../user.server"

const LOGIN_ROUTE = "/login"

export const requireUserId = createServerFn({ method: "GET" })
  .validator((data?: { redirectTo?: string }) => data)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    const userId = session?.user.id

    if (!isValidUserId(userId)) {
      const requestURLObject = getRequestUrl()
      const redirectToURL =
        data?.redirectTo ?? `${requestURLObject.pathname}${requestURLObject.search}`
      throw redirect(
        redirectToURL
          ? { to: LOGIN_ROUTE, search: { redirectTo: redirectToURL } }
          : { to: LOGIN_ROUTE },
      )
    }

    return userId
  })

export const requireGuestUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (session?.user.id) {
    throw redirect({ to: "/" })
  }
})

export const requireAuthConfiguration = createServerFn({
  method: "GET",
}).handler(async () => {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("Authentication BETTER_AUTH_SECRET is not configured")
  }
})

export const requireUserPermissions = createServerFn({ method: "GET" })
  .validator((data: { userId: string; permissions: ContentPermission[] }) => data)
  .handler(async ({ data: { userId, permissions } }) => {
    const result = await auth.api.userHasPermission({
      body: {
        userId,
        permissions: {
          content: permissions,
        },
      },
    })

    if (!result.success) {
      throw new Error("User does not have the required permissions")
    }

    return userId
  })

export const requireUserRole = createServerFn({ method: "GET" })
  .validator((data: { userId: string; roleName: string }) => data)
  .handler(async ({ data: { userId, roleName } }) => {
    const { hasUserRole } = await import("../roles.server")
    if (!(await hasUserRole(userId, roleName))) {
      throw new Error("User does not have the required role")
    }
  })
