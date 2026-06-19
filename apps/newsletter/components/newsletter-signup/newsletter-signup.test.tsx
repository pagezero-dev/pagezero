import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"

vi.mock("../../rpc/subscribe", () => ({
  subscribeFormAction: vi.fn(),
  subscribeFormSchema: z.object({
    email: z.email(),
    "cf-turnstile-response": z.string().optional(),
  }),
}))

vi.mock("@/form", () => ({
  useFormAction: vi.fn(),
}))

import { useFormAction } from "@/form"
import { NewsletterSignup } from "./newsletter-signup"

function mockUseFormAction(value: Partial<ReturnType<typeof useFormAction>>) {
  vi.mocked(useFormAction).mockReturnValue({
    data: undefined,
    error: null,
    isPending: false,
    onSubmit: vi.fn(),
    fields: {
      email: { name: "email", errors: [] },
      "cf-turnstile-response": { name: "cf-turnstile-response", errors: [] },
    },
    ...value,
  } as ReturnType<typeof useFormAction>)
}

describe("<NewsletterSignup />", () => {
  it("renders email field and subscribe button", () => {
    mockUseFormAction({})

    render(<NewsletterSignup />)
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Subscribe" }),
    ).toBeInTheDocument()
  })

  it("shows success message from form action", () => {
    mockUseFormAction({
      data: { success: "Check your email to confirm your subscription" },
    })

    render(<NewsletterSignup />)
    expect(
      screen.getByText("Check your email to confirm your subscription"),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Subscribe" }),
    ).not.toBeInTheDocument()
  })

  it("submits the form via onSubmit", async () => {
    const onSubmit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    mockUseFormAction({ onSubmit })

    const user = userEvent.setup()
    render(<NewsletterSignup />)
    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "reader@example.com",
    )
    await user.click(screen.getByRole("button", { name: "Subscribe" }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
