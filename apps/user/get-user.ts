import { createServerFn } from "@tanstack/react-start"
import { useAppSession } from "@/auth/session.server"
import { getUserById, getUserId } from "./user.server"

export type UserData = {
  user: { id: number; email: string } | null
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession()
  const userId = await getUserId(session)

  if (userId) {
    const user = await getUserById(userId)
    if (user) {
      return {
        user: { id: user.id, email: user.email },
      } satisfies UserData
    }
  }

  return { user: null } satisfies UserData
})
