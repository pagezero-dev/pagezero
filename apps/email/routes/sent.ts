import { createFileRoute } from "@tanstack/react-router"
import { developmentMailsSent } from "../email.server"

export const Route = createFileRoute("/emails/sent")({
  server: {
    handlers: {
      GET: async () => {
        if (import.meta.env.PROD) {
          return Response.json({ error: "Permission denied" }, { status: 403 })
        }

        return Response.json(developmentMailsSent)
      },
    },
  },
})
