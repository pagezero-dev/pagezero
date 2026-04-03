import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

describe("<Dialog />", () => {
  it("should open when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>
              Dialog description for testing
            </DialogDescription>
          </DialogHeader>
          <div>Dialog content</div>
        </DialogContent>
      </Dialog>,
    )

    // Dialog content should not be visible initially
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Dialog description for testing"),
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument()

    // Click the trigger button
    await user.click(screen.getByRole("button", { name: "Open Dialog" }))

    // Dialog content should be visible
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()
    expect(
      screen.getByText("Dialog description for testing"),
    ).toBeInTheDocument()
    expect(screen.getByText("Dialog content")).toBeInTheDocument()
  })

  it("should close when the close button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <div>Dialog content</div>
        </DialogContent>
      </Dialog>,
    )

    // Open the dialog
    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()

    // Click the close button (it has a sr-only "Close" text)
    await user.click(screen.getByText("Close"))

    // Dialog content should no longer be visible
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument()
  })
})
