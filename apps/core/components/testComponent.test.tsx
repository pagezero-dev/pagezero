import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { TestComponent } from "./testComponent"

describe("<TestComponent />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(<TestComponent />)
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Off")
    await user.click(button)
    expect(button).toHaveTextContent("On")
  })
})
