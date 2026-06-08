import { createFileRoute, redirect } from "@tanstack/react-router"
import { clearAppSession } from "@/auth/session.server"

export const Route = createFileRoute("/logout")({
  server: {
    handlers: {
      POST: async () => {
        await clearAppSession()
        throw redirect({ to: "/" })
      },
    },
  },
})
