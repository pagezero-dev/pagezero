import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Dropdown } from "./dropdown"

describe("<Dropdown />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown
        menu={
          <Dropdown.Menu>
            <Dropdown.MenuItem>
              <button type="button">Item 1</button>
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        }
      >
        <button type="button">Click me!</button>
      </Dropdown>,
    )
    const button = screen.getByRole("button", { name: "Click me!" })
    expect(button).toBeInTheDocument()
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument()
    await user.click(button)
    expect(screen.getByText("Item 1")).toBeInTheDocument()
  })
})
