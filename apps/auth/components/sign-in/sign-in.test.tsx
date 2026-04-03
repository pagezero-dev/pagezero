import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { SignIn } from "./sign-in"

describe("<SignIn />", async () => {
  it("renders only email input by default", () => {
    render(<SignIn />)
    expect(screen.getByText("Sign in")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.queryByLabelText("Verification code")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
  })

  it("renders only OTP input when email is provided", () => {
    render(<SignIn email="test@example.com" />)
    expect(screen.getByText("Verify email")).toBeInTheDocument()
    expect(screen.getByLabelText("Verification code")).toBeInTheDocument()
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Verify" })).toBeInTheDocument()
  })

  it("displays error message when provided", () => {
    const errorMessage = "Invalid credentials"
    render(<SignIn error={errorMessage} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it("displays success message when provided", () => {
    const successMessage = "Check your email"
    render(<SignIn success={successMessage} />)
    expect(screen.getByText(successMessage)).toBeInTheDocument()
  })

  it("clears OTP field when error occurs", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SignIn email="test@example.com" />)
    const otpInput = screen.getByLabelText("Verification code")

    // Type something in the OTP field
    await user.type(otpInput, "123456")
    expect(otpInput).toHaveValue("123456")

    // Simulate error occurring
    rerender(<SignIn email="test@example.com" error="Invalid code" />)
    await waitFor(() => {
      expect(otpInput).toHaveValue("")
    })
  })
})
