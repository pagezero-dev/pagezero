import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProseArticle } from "./prose-article"

describe("<ProseArticle />", () => {
  it("renders children content", () => {
    render(<ProseArticle>Test content</ProseArticle>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("renders title when provided", () => {
    render(<ProseArticle title="Test Title">Content</ProseArticle>)
    expect(
      screen.getByRole("heading", { level: 1, name: "Test Title" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("renders as an article element", () => {
    const { container } = render(<ProseArticle>Content</ProseArticle>)
    expect(container.querySelector("article")).toBeInTheDocument()
  })
})
