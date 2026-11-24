export type CloudflareConfig = {
  workerName: string
  compatibilityDate: string
  compatibilityFlags: string[]
  migrationsDir: string
  d1: {
    name: string
    id?: string
  }
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: string
    NEWSLETTER_SEGMENT_ID: string
  }
}
