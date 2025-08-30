import { CircleAlert } from "lucide-react"
import { isRouteErrorResponse } from "react-router"

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
      <CircleAlert className="text-destructive mx-auto h-16 w-16" />
      <h1 className="text-foreground text-center text-4xl font-bold">
        {title || defaultTitle}
      </h1>
      {(description || defaultDescription) && (
        <p className="text-muted-foreground text-center text-xl">
          {description || defaultDescription}
        </p>
      )}
      {error instanceof Error && (
        <pre className="border-destructive bg-destructive/10 text-destructive overflow-x-auto rounded-lg border border-t-8 p-5 text-sm shadow-xs">
          {error.stack}
        </pre>
      )}
    </main>
  )
}
