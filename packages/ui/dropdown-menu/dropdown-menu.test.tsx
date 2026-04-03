import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

describe("<DropdownMenu />", () => {
  it("should open when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    // Menu items should not be visible initially
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument()
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument()
    expect(screen.queryByText("Item 3")).not.toBeInTheDocument()

    // Click the trigger button
    await user.click(screen.getByRole("button", { name: "Open Menu" }))

    // Menu items should be visible
    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()
    expect(screen.getByText("Item 3")).toBeInTheDocument()
  })

  it("should close when Escape key is pressed", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    // Open the menu
    await user.click(screen.getByRole("button", { name: "Open Menu" }))
    expect(screen.getByText("Item 1")).toBeInTheDocument()

    // Press Escape key
    await user.keyboard("{Escape}")

    // Menu should be closed
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument()
  })

  it("should close when menu item is clicked", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    // Open the menu
    await user.click(screen.getByRole("button", { name: "Open Menu" }))
    expect(screen.getByText("Item 1")).toBeInTheDocument()

    // Click a menu item
    await user.click(screen.getByText("Item 1"))

    // Menu should be closed
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument()
  })
})
