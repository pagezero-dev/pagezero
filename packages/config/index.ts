import type { CoreConfig } from "@/core"
import type { EmailConfig } from "@/email"
import type { PaymentsConfig } from "@/payments"
import type { PermissionsConfig } from "@/permissions"

export const userRoles = ["premium", "elite"] as const

export type Config = CoreConfig &
  EmailConfig &
  PermissionsConfig &
  PaymentsConfig

const config: Config = {
  core: {
    supportEmail: "support@yourdomain.com",
    websiteUrl: "https://www.yourdomain.com",
    projectName: "Your App",
    darkMode: true,
    appTitle: "Your App - Your tagline here",
  },
  email: {
    from: "Acme <onboarding@resend.dev>",
  },
  permissions: {
    roleToPermissions: {
      premium: {
        viewPremiumContent: true,
      },
      elite: {
        viewPremiumContent: true,
        viewEliteContent: true,
      },
    },
  },
  payments: {
    products: {
      elite: {
        name: "Elite",
        userRoleToGrant: "elite",
        polarProductId: {
          preview: "your-sandbox-product-id",
          production: "your-production-product-id",
        },
        checkoutLink: {
          preview:
            "https://sandbox-api.polar.sh/v1/checkout-links/your-checkout-link-id/redirect",
          production:
            "https://sandbox-api.polar.sh/v1/checkout-links/your-checkout-link-id/redirect",
        },
      },
      premium: {
        name: "Premium",
        userRoleToGrant: "premium",
        polarProductId: {
          preview: "your-sandbox-product-id",
          production: "your-production-product-id",
        },
        checkoutLink: {
          preview:
            "https://sandbox-api.polar.sh/v1/checkout-links/your-checkout-link-id/redirect",
          production:
            "https://sandbox-api.polar.sh/v1/checkout-links/your-checkout-link-id/redirect",
        },
      },
    },
  },
}

export default config
