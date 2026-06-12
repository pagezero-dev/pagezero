import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ErrorPage } from "./error-page"

describe("<ErrorPage />", async () => {
  it("renders error name and message", async () => {
    const error = new Error("Something went wrong")
    error.name = "Application Error"

    render(<ErrorPage error={error} />)

    expect(screen.getByRole("heading", { name: "Application Error" }))
      .toBeInTheDocument()
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("renders default error name", async () => {
    render(<ErrorPage error="Something went wrong" />)

    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument()
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("renders error-like object properties", async () => {
    render(
      <ErrorPage
        error={{ name: "Server Error", message: "Internal server error" }}
      />,
    )

    expect(screen.getByRole("heading", { name: "Server Error" }))
      .toBeInTheDocument()
    expect(screen.getByText("Internal server error")).toBeInTheDocument()
  })

  it("renders action and details", async () => {
    const error = new Error(
      "The page you're looking for doesn't exist or has been moved.",
    )
    error.name = "Page not found"

    render(
      <ErrorPage
        error={error}
        details="Error: Page not found\n    at /missing"
        action={<a href="/">Go home</a>}
      />,
    )

    expect(screen.getByText("Page not found")).toBeInTheDocument()
    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or has been moved.",
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByText(/Error: Page not found/)).toBeInTheDocument()
  })
})
