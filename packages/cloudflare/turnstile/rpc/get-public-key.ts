import { env } from "cloudflare:workers"
import { createServerFn } from "@tanstack/react-start"

export const getTurnstilePublicKey = createServerFn({ method: "GET" }).handler(
  async () => ({
    cloudflareTurnstilePublicKey: env.CLOUDFLARE_TURNSTILE_PUBLIC_KEY,
  }),
)
