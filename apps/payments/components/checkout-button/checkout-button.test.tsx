import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CheckoutButton } from "./checkout-button"

const checkout = vi.fn()

vi.mock("@/auth/auth", () => ({
  auth: {
    checkout: (...args: unknown[]) => checkout(...args),
  },
}))

describe("<CheckoutButton />", async () => {
  beforeEach(() => {
    checkout.mockReset()
  })

  it("triggers polar checkout with product slug", async () => {
    checkout.mockResolvedValue({ data: null, error: null })
    const user = userEvent.setup()
    render(<CheckoutButton productId="elite">Get Elite</CheckoutButton>)

    const button = screen.getByRole("button", { name: "Get Elite" })
    expect(button).toBeInTheDocument()
    await user.click(button)

    await vi.waitFor(() => {
      expect(checkout).toHaveBeenCalledWith({ slug: "elite" })
    })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("shows a dialog when checkout returns an error", async () => {
    checkout.mockResolvedValue({
      data: null,
      error: { message: "Polar is not configured. Set POLAR_ACCESS_TOKEN to enable payments." },
    })
    const user = userEvent.setup()
    render(<CheckoutButton productId="premium">Get Pro</CheckoutButton>)

    await user.click(screen.getByRole("button", { name: "Get Pro" }))

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveTextContent("Checkout unavailable")
    expect(dialog).toHaveTextContent(
      "Polar is not configured. Set POLAR_ACCESS_TOKEN to enable payments.",
    )
  })
})
