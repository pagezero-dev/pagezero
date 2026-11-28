import production from "./production.ts"

const development = {
  ...production,
  d1: [
    {
      binding: "DB_MAIN",
      name: `${production.workerName}-development`,
      // UUID v4 local-only id: `cf d1` rejects Wrangler's `<DATABASE_ID>` placeholder.
      id: "00000000-0000-4000-8000-000000000000",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "1x00000000000000000000BB",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

export default development
