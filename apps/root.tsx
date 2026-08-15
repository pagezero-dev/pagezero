import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { type ReactNode } from "react"

import config from "@/config"
import ogImage from "@/core/assets/og.png"
import { ErrorPage } from "@/core/components/error-page"
import fonts from "@/core/fonts/inter-normal-latin.woff2?url"
import { Button } from "@/ui/button"

import styles from "@/core/styles/index.css?url"

export const Route = createRootRoute({
  head: ({ matches }) => {
    const { appTitle, appDescription, appKeywords, websiteUrl, projectName } = config.core
    const imageUrl = new URL(ogImage, websiteUrl).href
    const pathname = matches.at(-1)?.pathname ?? "/"
    const canonicalUrl = new URL(pathname, websiteUrl).href
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { title: appTitle },
        ...(appDescription ? [{ name: "description", content: appDescription }] : []),
        ...(appKeywords ? [{ name: "keywords", content: appKeywords.join(", ") }] : []),
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: projectName },
        { property: "og:url", content: canonicalUrl },
        { property: "og:title", content: appTitle },
        ...(appDescription ? [{ property: "og:description", content: appDescription }] : []),
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: appTitle },
        ...(appDescription ? [{ name: "twitter:description", content: appDescription }] : []),
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
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
    }
  },
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
