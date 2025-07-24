import { isRouteErrorResponse } from "react-router"
import { CircleAlert } from "lucide-react"

interface ErrorPageProps {
  title?: string
  description?: string
  error?: unknown
}

export const ErrorPage = ({ title, description, error }: ErrorPageProps) => {
  const defaultTitle = isRouteErrorResponse(error)
    ? `${error.status} error`
    : "Application Error"
  const defaultDescription = isRouteErrorResponse(error)
    ? error.statusText
    : null
  return (
    <main className="container mx-auto flex h-screen flex-col justify-center gap-5">
      <CircleAlert className="mx-auto h-16 w-16 text-red-500" />
      <h1 className="text-center text-4xl font-bold">
        {title || defaultTitle}
      </h1>
      {(description || defaultDescription) && (
        <p className="text-center text-xl text-gray-600">
          {description || defaultDescription}
        </p>
      )}
      {error instanceof Error && (
        <pre className="overflow-x-auto rounded-lg border border-t-8 border-red-500 bg-red-50 p-5 text-sm text-red-500 shadow-sm">
          {error.stack}
        </pre>
      )}
    </main>
  )
}
