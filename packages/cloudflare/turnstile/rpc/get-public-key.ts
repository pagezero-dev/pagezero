import { createServerFn } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

export const getTurnstilePublicKey = createServerFn({ method: "GET" }).handler(async () => ({
  cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
}))
