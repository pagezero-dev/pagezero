import { index, type RouteConfig, route } from "@react-router/dev/routes"

export default [
  index("../content/routes/home.tsx"),
  route("about", "../content/routes/about.mdx"),
] satisfies RouteConfig
