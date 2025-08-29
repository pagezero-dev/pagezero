import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1"
import { createRequestHandler } from "react-router"
import * as schema from "../packages/db/schema"

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
    env: Env
    db: DrizzleD1Database<typeof schema>
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module handled by React Router at build time
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
)

export default {
  async fetch(request, env, ctx) {
    const db = drizzle(env.DB, { schema })

    return requestHandler(request, {
      cloudflare: { env, ctx },
      env,
      db,
    })
  },
} satisfies ExportedHandler<Env>
