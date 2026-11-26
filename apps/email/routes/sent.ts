import { createFileRoute } from "@tanstack/react-router"

import { getAppMode } from "@/core"

import { developmentMailsSent } from "../email.server"

export const Route = createFileRoute("/emails/sent")({
  server: {
    handlers: {
      GET: async () => {
        const mode = getAppMode()
        if (mode === "production" || mode === "preview") {
          return Response.json({ error: "Permission denied" }, { status: 403 })
        }

        return Response.json(developmentMailsSent)
      },
    },
  },
})
