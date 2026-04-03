import { createContext, type SessionStorage } from "react-router"

interface AuthContext {
  session: Awaited<ReturnType<SessionStorage["getSession"]>>
  commitSession: SessionStorage["commitSession"]
  destroySession: SessionStorage["destroySession"]
}

export const authContext = createContext<AuthContext>()
