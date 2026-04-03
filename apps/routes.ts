import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes"

export default [
  layout("./content/routes/layout.tsx", [
    index("./content/routes/home.tsx"),
    route("privacy", "./content/routes/privacy.tsx"),
    route("terms-and-conditions", "./content/routes/terms-and-conditions.tsx"),
  ]),

  route("user", "./user/routes/user.tsx"),
  route("login", "./auth/routes/login.tsx"),
  route("logout", "./auth/routes/logout.tsx"),

  ...prefix("payments", [
    route("success", "./payments/routes/success.tsx"),
    route("webhook", "./payments/routes/webhook.tsx"),
  ]),

  // Non-production routes
  route("emails/sent", "./email/routes/sent.ts"),
] satisfies RouteConfig
