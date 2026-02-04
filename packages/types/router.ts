import type { RouterContextProvider } from "react-router"

export type MiddlewareArgs = {
  request: Request
  context: Readonly<RouterContextProvider>
}
