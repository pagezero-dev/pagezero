import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ErrorPage } from "./error-page"

describe("<ErrorPage />", async () => {
  it("renders", async () => {
    render(<ErrorPage title="Application error" />)
    const element = screen.getByText("Application error")
    expect(element).toBeInTheDocument()
  })
})
