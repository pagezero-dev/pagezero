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
}

export default preview
