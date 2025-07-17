import { type AppLoadContext } from "react-router"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./packages/db/schema"
import { type Cloudflare } from "./apps/core/env"

type GetLoadContext = (args: {
  request: Request
  context: { cloudflare: Cloudflare } // load context _before_ augmentation
}) => AppLoadContext

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  const env = context.cloudflare.env
  const dbBinding = env.DB

  if (!dbBinding) {
    throw new Error(`Cloudflare database binding "DB" not found`)
  }

  const db = drizzle(dbBinding, { schema })
  return {
    ...context,
    db,
    env,
  }
}
