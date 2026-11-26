import development from "./development.ts"

const e2e = {
  ...development,
  vars: {
    CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
    NEWSLETTER_SEGMENT_ID: "",
  },
}

export default e2e
