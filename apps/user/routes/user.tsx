import { authContext } from "@/auth/context"
import { dbContext } from "@/db/context"
import { getUserById, getUserId } from "../user.server"
import type { Route } from "./+types/user"

export type UserData = {
  user: { id: number; email: string } | null
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.get(dbContext)
  const { session } = context.get(authContext)
  const userId = await getUserId(session)

  if (userId) {
    const user = await getUserById(db, userId)
    if (user) {
      return Response.json({
        user: { id: user.id, email: user.email },
      } satisfies UserData)
    }
  }

  return Response.json({ user: null } satisfies UserData)
}
