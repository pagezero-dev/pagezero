import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Checkbox } from "./checkbox"

describe("<Checkbox />", () => {
  it("renders and responds to click", async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Test checkbox" />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
