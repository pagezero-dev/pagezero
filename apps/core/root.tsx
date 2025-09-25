import { type ReactNode } from "react"
import { Links, Meta, Outlet, Scripts, useRouteError } from "react-router"
import { ErrorPage } from "@/core/components/error-page"
import fonts from "./fonts/inter-normal-latin.woff2?url"
import styles from "./styles/index.css?url"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <link rel="stylesheet" href={styles} crossOrigin="anonymous"></link>
        <Links />
      </head>
      <body className="dark">
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
