import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Label } from "./label"

describe("<Label />", () => {
  it("renders with text content", () => {
    render(<Label>Test Label</Label>)

    expect(screen.getByText("Test Label")).toBeInTheDocument()
  })
})
