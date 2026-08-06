import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "../auth.server"

export type UserData = {
  user: { id: string; email: string; name: string; role?: string | null } | null
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (session?.user) {
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    } satisfies UserData
  }

  return { user: null } satisfies UserData
})
