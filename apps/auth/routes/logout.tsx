import { redirect } from "react-router"
import { authContext } from "../context"
import type { Route } from "./+types/logout"

export async function action({ context }: Route.ActionArgs) {
  const { session, destroySession } = context.get(authContext)
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}
