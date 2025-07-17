import { type PlatformProxy } from "wrangler"
import { DrizzleD1Database } from "drizzle-orm/d1"
import * as schema from "@/db/schema"

import { Env } from "./config/env.type"

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: Cloudflare
    db: DrizzleD1Database<typeof schema> // augmented
    env: Env
  }

  // TODO: remove this once we've migrated to `Route.LoaderArgs` instead for our loaders
  interface LoaderFunctionArgs {
    context: AppLoadContext
  }

  // TODO: remove this once we've migrated to `Route.ActionArgs` instead for our actions
  interface ActionFunctionArgs {
    context: AppLoadContext
  }
}
