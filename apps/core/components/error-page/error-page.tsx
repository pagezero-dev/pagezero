import { CircleAlert } from "lucide-react"
import type { ReactNode } from "react"

interface ErrorPageProps {
  title?: string
  description?: string
  error?: unknown
  variant?: "error" | "not-found"
  action?: ReactNode
}

function isHttpError(
  error: unknown,
): error is { status: number; statusText?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  )
}

export const ErrorPage = ({
  title,
  description,
  error,
  variant = "error",
  action,
}: ErrorPageProps) => {
  const isNotFound = variant === "not-found"
  const defaultTitle = isNotFound
    ? "Page not found"
    : isHttpError(error)
      ? `${error.status} error`
      : "Application Error"
  const defaultDescription = isNotFound
    ? "The page you're looking for doesn't exist or has been moved."
    : isHttpError(error)
      ? error.statusText
      : null

  return (
    <main className="container mx-auto flex h-screen flex-col justify-center gap-5">
      <CircleAlert className="mx-auto h-16 w-16 text-destructive" />
      <h1 className="text-center font-bold text-4xl text-foreground">
        {title || defaultTitle}
      </h1>
      {(description || defaultDescription) && (
        <p className="text-center text-muted-foreground text-xl">
          {description || defaultDescription}
        </p>
      )}
      {action && <div className="text-center">{action}</div>}
      {!isNotFound && error instanceof Error && (
        <pre className="overflow-x-auto rounded-lg border border-destructive border-t-8 bg-destructive/10 p-5 text-destructive text-sm shadow-xs">
          {error.stack}
        </pre>
      )}
    </main>
  )
}
