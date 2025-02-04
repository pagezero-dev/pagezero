import { Links, Meta, Outlet, Scripts, useRouteError } from "react-router"

import styles from "./styles/index.css?url"
import fonts from "./fonts/inter-normal-latin.woff2?url"
import { ErrorPage } from "@/ui/error-page"

export function Layout({ children }: { children: React.ReactNode }) {
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
            <link rel="preload" as="style" href={styles}></link>
            <link rel="preload" as="font" href={fonts}></link>
          </>
        )}
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <link rel="stylesheet" href={styles}></link>
        <Links />
      </head>
      <body>
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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Error</title>
        <Meta />
        <style>
          {`
          html {
            /*
              Remove annoying horizontal layout shift whenever
              user transitons between pages with and without scrollbar.
            */
            margin-left: calc(100vw - 100%);
          }
          `}
        </style>
        <link rel="preload" as="style" href={styles}></link>
        <link rel="stylesheet" href={styles}></link>
      </head>
      <body className="text-gray-900">
        <ErrorPage error={error} />
        <Scripts />
      </body>
    </html>
  )
}
