import type { CloudflareConfig } from "../../cloudflare/types.ts"

const workerName = "pagezero"

const production: CloudflareConfig = {
  workerName,
  d1: [
    {
      binding: "DB_MAIN",
      name: `${workerName}-production`,
      id: "1e6b30f9-afaa-4368-8b76-06ed8d4fe737",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "0x4AAAAAABd1vnMC0VAcAlf3",
    NEWSLETTER_SEGMENT_ID: "f7ba881f-cec0-4c63-94ff-e3d5cc867f21",
  },
}

export default production
