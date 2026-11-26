const production = {
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
        userRoleToGrant: "elite" as const,
        polarProductId: "your-production-product-id",
      },
      premium: {
        name: "Premium",
        userRoleToGrant: "premium" as const,
        polarProductId: "your-production-product-id",
      },
    },
  },
}

export default production
