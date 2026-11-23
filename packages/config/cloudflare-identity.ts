export const workerName = "pagezero"

export const d1MigrationsDir = "./packages/db/main/migrations"

export interface D1DatabaseRef {
  name: string
  id?: string
}

export const d1Main: Record<"development" | "production" | "preview", D1DatabaseRef> = {
  // UUID v4 local-only id: `cf d1` rejects Wrangler's `<DATABASE_ID>` placeholder.
  development: { name: "pagezero-development", id: "00000000-0000-4000-8000-000000000000" },
  production: {
    name: "pagezero-production",
    id: "1e6b30f9-afaa-4368-8b76-06ed8d4fe737",
  },
  preview: {
    name: "pagezero-preview",
    id: "6eb90f35-05ce-4d9e-bd6d-a4b10ebe8c09",
  },
}

export const modeVars = {
  development: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "1x00000000000000000000BB",
    NEWSLETTER_SEGMENT_ID: "",
  },
  production: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "0x4AAAAAABd1vnMC0VAcAlf3",
    NEWSLETTER_SEGMENT_ID: "f7ba881f-cec0-4c63-94ff-e3d5cc867f21",
  },
  preview: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "0x4AAAAAABd1vnMC0VAcAlf3",
    NEWSLETTER_SEGMENT_ID: "f7ba881f-cec0-4c63-94ff-e3d5cc867f21",
  },
  test: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

export type CloudflareMode = "development" | "production" | "preview" | "test"

export function getD1Main(mode?: string) {
  if (mode === "production") {
    return d1Main.production
  }
  if (mode === "preview") {
    return d1Main.preview
  }
  return d1Main.development
}

export function getModeVars(mode?: string) {
  if (mode === "production") {
    return modeVars.production
  }
  if (mode === "preview") {
    return modeVars.preview
  }
  if (mode === "test") {
    return modeVars.test
  }
  return modeVars.development
}
