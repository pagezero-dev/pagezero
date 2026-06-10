import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ErrorPage } from "./error-page"

describe("<ErrorPage />", async () => {
  it("renders", async () => {
    render(<ErrorPage title="Application error" />)
    const element = screen.getByText("Application error")
    expect(element).toBeInTheDocument()
  })

  it("renders not found variant", async () => {
    render(<ErrorPage variant="not-found" action={<a href="/">Go home</a>} />)
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
  })
})
