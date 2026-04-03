import { developmentMailsSent } from "../email.server"

export async function loader() {
  if (import.meta.env.PROD) {
    return Response.json(
      {
        error: "Permission denied",
      },
      {
        status: 403,
      },
    )
  }

  return Response.json(developmentMailsSent)
}
