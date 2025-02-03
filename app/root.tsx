import { Links, Meta, Outlet, Scripts, useRouteError } from "react-router"
import type { HeadersFunction } from "react-router"

import styles from "./styles/index.css?url"
import fonts from "./fonts/inter-normal-latin.woff2?url"
import { ErrorPage } from "@/ui/error-page"

export const headers: HeadersFunction = () => {
  return {
    Link: `<${styles}>; rel=preload; as=style`,
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <link rel="preload" as="style" href={styles}></link>
        <link rel="preload" as="font" href={fonts}></link>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <link rel="stylesheet" href={styles}></link>
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
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
