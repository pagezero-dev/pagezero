import type { CoreConfig } from "@/core"
import type { EmailConfig } from "@/email"
import type { PaymentsConfig } from "@/payments"

export type Config = CoreConfig & EmailConfig & PaymentsConfig

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
  payments: {
    products: {
      elite: {
        name: "Elite",
        userRoleToGrant: "elite",
        polarProductId: {
          preview: "your-sandbox-product-id",
          production: "your-production-product-id",
        },
      },
      premium: {
        name: "Premium",
        userRoleToGrant: "premium",
        polarProductId: {
          preview: "your-sandbox-product-id",
          production: "your-production-product-id",
        },
      },
    },
  },
}

export default config
