import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { Button } from "./button"

describe("<Button />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(<Button>Test text</Button>)
    const element = screen.getByText("Test text")
    await user.click(element)
    expect(element).toBeInTheDocument()
  })
})
