import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Dialog } from "./dialog"

describe("<Dialog />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(
      <Dialog
        content={
          <Dialog.Content
            title="dialog title"
            description="dialog description"
            onOk={() => {}}
          >
            dialog content
          </Dialog.Content>
        }
      >
        <button type="button">Open dialog</button>
      </Dialog>,
    )
    const button = screen.getByRole("button", { name: "Open dialog" })
    expect(screen.queryByText("dialog title")).not.toBeInTheDocument()
    await user.click(button)
    expect(screen.getByText("dialog title")).toBeInTheDocument()
    expect(screen.getByText("dialog description")).toBeInTheDocument()
    expect(screen.getByText("dialog content")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "OK" }))
    expect(screen.queryByText("dialog title")).not.toBeInTheDocument()
  })
})
