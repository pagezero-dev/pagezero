import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes"

export const routes = rootRoute("root.tsx", [
  layout("content-layout", "content/routes/layout.tsx", [
    index("content/routes/home.tsx"),
    route("/privacy", "content/routes/privacy.tsx"),
    route("/terms-and-conditions", "content/routes/terms-and-conditions.tsx"),
  ]),
  route("/login", "auth/routes/login.tsx"),
  route("/payments/success", "payments/routes/success.tsx"),
  route("/payments/webhook", "payments/routes/webhook.ts"),
  route("/emails/sent", "email/routes/sent.ts"),
])
