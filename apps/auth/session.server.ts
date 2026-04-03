import { createCookieSessionStorage } from "react-router"

export type SessionData = {
  userId: string
}

export type SessionStorage = ReturnType<typeof createSessionStorage>

export function createSessionStorage(sessionCookieSecret?: string) {
  if (!sessionCookieSecret) {
    throw new Error("SESSION_COOKIE_SECRET is not set")
  }

  const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData>({
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days,
        path: "/",
        sameSite: "strict",
        secrets: [sessionCookieSecret],
        secure: true,
      },
    })

  return { getSession, commitSession, destroySession }
}
