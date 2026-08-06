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
          preview: "7b7f14e6-06c2-4779-b61d-ad622e111d4a",
          production: "your-production-product-id",
        },
      },
      premium: {
        name: "Premium",
        userRoleToGrant: "premium",
        polarProductId: {
          preview: "44a8395f-4b29-4aba-9de3-24858fac87ff",
          production: "your-production-product-id",
        },
      },
    },
  },
}

export default config
