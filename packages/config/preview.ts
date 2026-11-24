import production from "./production.ts"

const preview = {
  ...production,
  payments: {
    products: {
      elite: {
        ...production.payments.products.elite,
        polarProductId: "7b7f14e6-06c2-4779-b61d-ad622e111d4a",
      },
      premium: {
        ...production.payments.products.premium,
        polarProductId: "44a8395f-4b29-4aba-9de3-24858fac87ff",
      },
    },
  },
  cloudflare: {
    ...production.cloudflare,
    d1: production.cloudflare.d1.map((database) =>
      database.binding === "DB_MAIN"
        ? {
            ...database,
            name: `${production.cloudflare.workerName}-preview`,
            id: "6eb90f35-05ce-4d9e-bd6d-a4b10ebe8c09",
          }
        : database,
    ),
  },
}

export default preview
