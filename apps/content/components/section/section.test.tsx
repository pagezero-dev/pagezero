import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Section } from "./section"

describe("<Section />", () => {
  it("renders children content", () => {
    render(<Section>Test content</Section>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("renders title when provided", () => {
    render(<Section title="Test Title">Content</Section>)
    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("renders description when provided with title", () => {
    render(
      <Section title="Test Title" description="Test description">
        Content
      </Section>,
    )
    expect(screen.getByText("Test description")).toBeInTheDocument()
  })

  it("renders all props together", () => {
    render(
      <Section title="Test Title" description="Test description">
        Test content
      </Section>,
    )
    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("renders as a section element", () => {
    const { container } = render(<Section>Content</Section>)
    expect(container.querySelector("section")).toBeInTheDocument()
  })

  it("renders with custom id when provided", () => {
    const { container } = render(<Section id="custom-section">Content</Section>)
    const section = container.querySelector("section")
    expect(section).toHaveAttribute("id", "custom-section")
  })
})
