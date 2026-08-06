import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "../auth.server"

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await auth.api.signOut({
    headers: getRequestHeaders(),
  })
  throw redirect({ to: "/" })
})
