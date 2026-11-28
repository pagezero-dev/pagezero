import production from "./production.ts"

const preview = {
  ...production,
  d1: [
    {
      binding: "DB_MAIN",
      name: `${production.workerName}-preview`,
      id: "6eb90f35-05ce-4d9e-bd6d-a4b10ebe8c09",
      migrationsDir: "./packages/db/main/migrations",
    },
  ],
}

export default preview
