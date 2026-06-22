import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { type ReactNode } from "react"
import config from "@/config"
import { ErrorPage } from "@/core/components/error-page"
import fonts from "@/core/fonts/inter-normal-latin.woff2?url"
import styles from "@/core/styles/index.css?url"
import { Button } from "@/ui/button"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: config.core.appTitle },
      ...(config.core.appDescription
        ? [{ name: "description", content: config.core.appDescription }]
        : []),
      ...(config.core.appKeywords
        ? [{ name: "keywords", content: config.core.appKeywords.join(", ") }]
        : []),
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "stylesheet",
        href: styles,
        crossOrigin: "anonymous" as const,
      },
      ...(!import.meta.env.DEV
        ? [
            {
              rel: "preload",
              as: "style",
              href: styles,
              crossOrigin: "anonymous" as const,
            },
            {
              rel: "preload",
              as: "font",
              href: fonts,
              crossOrigin: "anonymous" as const,
            },
          ]
        : []),
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootErrorComponent({ error }: { error: unknown }) {
  return (
    <RootDocument>
      <ErrorPage error={error} />
    </RootDocument>
  )
}

function RootNotFoundComponent() {
  return (
    <ErrorPage
      error={{
        name: "Page not found",
        message: "The page you're looking for doesn't exist or has been moved.",
      }}
      action={
        <Button asChild variant="outline">
          <a href="/">Go home</a>
        </Button>
      }
    />
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className={config.core.darkMode ? "dark" : ""}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
