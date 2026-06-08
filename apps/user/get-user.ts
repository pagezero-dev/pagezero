import { createServerFn } from "@tanstack/react-start"

export type UserData = {
  user: { id: number; email: string } | null
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { useAppSession } = await import("@/auth/session.server")
  const { getDb } = await import("@/db")
  const { getUserById, getUserId } = await import("./user.server")

  const session = await useAppSession()
  const db = getDb()
  const userId = await getUserId(session)

  if (userId) {
    const user = await getUserById(db, userId)
    if (user) {
      return {
        user: { id: user.id, email: user.email },
      } satisfies UserData
    }
  }

  return { user: null } satisfies UserData
})
