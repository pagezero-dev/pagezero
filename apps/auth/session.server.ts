import { env } from "cloudflare:workers"
import { useSession } from "@tanstack/react-start/server"

export type SessionData = {
  userId?: string
}

function getSessionConfig() {
  const sessionCookieSecret = env.SESSION_COOKIE_SECRET
  if (!sessionCookieSecret) {
    throw new Error("SESSION_COOKIE_SECRET is not set")
  }

  return {
    name: "__session",
    password: sessionCookieSecret,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict" as const,
      secure: import.meta.env.PROD,
    },
  }
}

export async function useAppSession() {
  return useSession<SessionData>(getSessionConfig())
}

export async function updateAppSession(
  update:
    | Partial<SessionData>
    | ((oldData: SessionData) => Partial<SessionData>),
) {
  const session = await useAppSession()
  return session.update(update)
}

export async function clearAppSession() {
  const session = await useAppSession()
  return session.clear()
}
