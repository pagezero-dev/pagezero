import type { PaidRole } from "@/auth/access"
import config from "@/config"

export type PaymentsConfig = {
  payments: {
    products: Record<
      string,
      {
        name: string
        userRoleToGrant: PaidRole
        polarProductId: {
          preview: string
          production: string
        }
      }
    >
  }
}

export type Product = keyof (typeof config)["payments"]["products"]
