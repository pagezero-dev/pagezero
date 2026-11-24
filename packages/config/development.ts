import preview from "./preview.ts"
import production from "./production.ts"

const development = {
  ...production,
  payments: preview.payments,
  cloudflare: {
    ...production.cloudflare,
    d1: production.cloudflare.d1.map((database) =>
      database.binding === "DB_MAIN"
        ? {
            ...database,
            name: `${production.cloudflare.workerName}-development`,
            // UUID v4 local-only id: `cf d1` rejects Wrangler's `<DATABASE_ID>` placeholder.
            id: "00000000-0000-4000-8000-000000000000",
          }
        : database,
    ),
    vars: {
      CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "1x00000000000000000000BB",
      NEWSLETTER_SEGMENT_ID: "",
    },
  },
}

export default development
