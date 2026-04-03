import { type ReactNode } from "react"
import { Links, Meta, Outlet, Scripts, useRouteError } from "react-router"
import { authMiddleware } from "@/auth/middleware.server"
import config from "@/config"
import { ErrorPage } from "@/core/components/error-page"
import fonts from "@/core/fonts/inter-normal-latin.woff2?url"
import styles from "@/core/styles/index.css?url"
import type { Route } from "./+types/root"

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.core.appTitle}</title>
        {config.core.appDescription && (
          <meta name="description" content={config.core.appDescription} />
        )}
        {config.core.appKeywords && (
          <meta name="keywords" content={config.core.appKeywords.join(", ")} />
        )}
        <Meta />
        {!import.meta.env.DEV && (
          // When link preload is present for styles, hot reloading for Tailwind
          // stops working. As such, let's not render preload links in development.
          <>
            <link
              rel="preload"
              as="style"
              href={styles}
              crossOrigin="anonymous"
            ></link>
            <link
              rel="preload"
              as="font"
              href={fonts}
              crossOrigin="anonymous"
            ></link>
          </>
        )}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={config.core.websiteUrl} />
        <link rel="stylesheet" href={styles} crossOrigin="anonymous" />
        <Links />
      </head>
      <body className={config.core.darkMode ? "dark" : ""}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()

  return <ErrorPage error={error} />
}
