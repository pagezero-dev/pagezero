import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Input } from "./input"

describe("<Input />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Test placeholder" />)
    const element = screen.getByPlaceholderText("Test placeholder")
    await user.type(element, "Test input")
    expect(element).toBeInTheDocument()
    expect(element).toHaveValue("Test input")
  })
})
