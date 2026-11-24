import development from "./development.ts"

const e2e = {
  ...development,
  cloudflare: {
    ...development.cloudflare,
    d1: [
      {
        binding: "DB_MAIN",
        name: `${development.cloudflare.workerName}-development`,
        id: "00000000-0000-4000-8000-000000000000",
        migrationsDir: "./packages/db/main/migrations",
      },
    ],
    vars: {
      CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "",
      NEWSLETTER_SEGMENT_ID: "",
    },
  },
}

export default e2e
