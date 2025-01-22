import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { ErrorPage } from "./error-page"

describe("<ErrorPage />", async () => {
  it("renders", async () => {
    render(<ErrorPage title="Application error" />)
    const element = screen.getByText("Application error")
    expect(element).toBeInTheDocument()
  })
})
