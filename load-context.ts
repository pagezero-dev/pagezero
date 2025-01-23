import { type AppLoadContext } from "react-router"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./db/schema"
import { type Cloudflare } from "./app/env"

type GetLoadContext = (args: {
  request: Request
  context: { cloudflare: Cloudflare } // load context _before_ augmentation
}) => AppLoadContext

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  const env = context.cloudflare.env
  const dbBindingId = env.DB_BINDING

  if (!dbBindingId) {
    throw new Error("Environment variable DB_BINDING is required")
  }

  const dbBinding = context.cloudflare.env[
    dbBindingId as keyof typeof context.cloudflare.env
  ] as D1Database | undefined

  if (!dbBinding) {
    throw new Error(`Cloudflare database binding "${dbBinding}" not found`)
  }

  const db = drizzle(dbBinding, { schema })
  return {
    ...context,
    db,
    env,
  }
}
