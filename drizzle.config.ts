import { defineConfig } from "drizzle-kit"
import { getDrizzleConfig } from "@/db/config"

export default defineConfig(getDrizzleConfig())
