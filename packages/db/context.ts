import type { DrizzleD1Database } from "drizzle-orm/d1"
import { createContext } from "react-router"
import * as schema from "./schema"

export const dbContext = createContext<DrizzleD1Database<typeof schema>>()
