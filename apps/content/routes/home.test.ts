import fs from "node:fs"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { DrizzleD1Database } from "drizzle-orm/d1"
import { beforeAll, beforeEach, describe, expect, it } from "vitest"
import * as schema from "@/db/schema"
import { greetings } from "@/db/schema"
import type { Route } from "@/types/route"
import { loader } from "./home"

describe("loader", () => {
  const sqlite = new Database(":memory:")
  const db = drizzle(sqlite, { schema }) as unknown as DrizzleD1Database<
    typeof schema
  >

  beforeAll(async () => {
    const schemaSQL = fs.readFileSync("./packages/db/schema.sql", "utf8")
    sqlite.exec(schemaSQL)
  })

  beforeEach(async () => {
    // Reset the database
    await db.delete(greetings)

    // Seed the database
    await db.insert(greetings).values({ greeting: "Hello, world!" })
  })

  it("should return the greetings", async () => {
    const result = await loader({
      context: { db },
    } as Route.LoaderArgs)

    expect(result).toEqual({
      greetings: [{ id: 1, greeting: "Hello, world!" }],
    })
  })
})
