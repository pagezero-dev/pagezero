import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { clearAppSession } from "../session.server"

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await clearAppSession()
  throw redirect({ to: "/" })
})
