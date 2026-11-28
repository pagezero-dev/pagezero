import preview from "./preview.ts"
import production from "./production.ts"

const development = {
  ...production,
  payments: preview.payments,
}

export default development
