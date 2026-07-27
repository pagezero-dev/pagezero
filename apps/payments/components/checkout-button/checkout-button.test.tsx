import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CheckoutButton } from "./checkout-button"

const checkout = vi.fn()

vi.mock("@/auth/auth-client", () => ({
  authClient: {
    checkout: (...args: unknown[]) => checkout(...args),
  },
}))

describe("<CheckoutButton />", async () => {
  it("triggers polar checkout with product slug", async () => {
    const user = userEvent.setup()
    render(<CheckoutButton productId="elite">Get Elite</CheckoutButton>)

    const button = screen.getByRole("button", { name: "Get Elite" })
    expect(button).toBeInTheDocument()
    await user.click(button)

    expect(checkout).toHaveBeenCalledWith({ slug: "elite" })
  })
})
