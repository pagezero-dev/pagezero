import { polarClient } from "@polar-sh/better-auth/client"
import { adminClient, emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { ac, admin, elite, premium, user } from "./access"

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    adminClient({
      ac,
      roles: {
        admin,
        user,
        premium,
        elite,
      },
    }),
    polarClient(),
  ],
})
