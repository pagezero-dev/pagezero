import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "./badge"

describe("<Badge />", () => {
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>)

    const badge = screen.getByText("Default Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-slot", "badge")
  })

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)

    const badge = screen.getByText("Secondary Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-secondary")
  })

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)

    const badge = screen.getByText("Destructive Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-destructive")
  })

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>)

    const badge = screen.getByText("Outline Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("text-foreground")
  })

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)

    const badge = screen.getByText("Custom Badge")
    expect(badge).toHaveClass("custom-class")
  })

  it("renders as child component when asChild is true", () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>,
    )

    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveAttribute("data-slot", "badge")
  })
})
