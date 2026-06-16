import type { Decorator } from "@storybook/react-vite"
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"

export const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({
    component: () => <Story />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })
  void router.load()

  return <RouterProvider router={router} />
}
