import { drizzle } from "drizzle-orm/d1"
import { createRequestHandler, RouterContextProvider } from "react-router"
import { envContext } from "@/core/context"
import { dbContext } from "@/db/context"
import * as schema from "@/db/schema"

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
)

export default {
  async fetch(request, env) {
    const db = drizzle(env.DB, { schema })

    const context = new RouterContextProvider()
    context.set(dbContext, db)
    context.set(envContext, env)

    return requestHandler(request, context)
  },
} satisfies ExportedHandler<Env>
