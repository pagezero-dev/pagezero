import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes"

export const routes = rootRoute("root.tsx", [
  layout("brand-layout", "brand/routes/layout.tsx", [
    index("brand/routes/home.tsx"),
    route("/privacy", "brand/routes/privacy.tsx"),
    route("/terms-and-conditions", "brand/routes/terms-and-conditions.tsx"),
    route("/blog", "blog/routes/index.tsx"),
    route("/blog/$slug", "blog/routes/post.tsx"),
  ]),
  route("/login", "auth/routes/login.tsx"),
  route("/payments/success", "payments/routes/success.tsx"),
  route("/payments/webhook", "payments/routes/webhook.ts"),
  route("/emails/sent", "email/routes/sent.ts"),
])
