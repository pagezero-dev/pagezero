import { CircleAlert } from "lucide-react"
import type { ReactNode } from "react"

interface ErrorPageProps {
  error: unknown
  details?: string
  action?: ReactNode
}

function getErrorName(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name
  }
  return "Error"
}

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") return error
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }
}

export const ErrorPage = ({ error, details, action }: ErrorPageProps) => {
  const name = getErrorName(error)
  const message = getErrorMessage(error)

  return (
    <main className="container mx-auto flex h-screen flex-col justify-center gap-5">
      <CircleAlert className="text-destructive mx-auto h-16 w-16" />
      <h1 className="text-foreground text-center text-4xl font-bold">{name}</h1>
      {message && <p className="text-muted-foreground text-center text-xl">{message}</p>}
      {action && <div className="text-center">{action}</div>}
      {details && (
        <pre className="border-destructive bg-destructive/10 text-destructive overflow-x-auto rounded-lg border border-t-8 p-5 text-sm shadow-xs">
          {details}
        </pre>
      )}
    </main>
  )
}
