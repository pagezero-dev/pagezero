export type D1DatabaseConfig = {
  binding: string
  name: string
  id?: string
  migrationsDir?: string
}

export type CloudflareConfig = {
  workerName: string
  d1: D1DatabaseConfig[]
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: string
    NEWSLETTER_SEGMENT_ID: string
  }
}
