import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Testimonials } from "./testimonials"

describe("<Testimonials />", async () => {
  it("renders", async () => {
    render(
      <Testimonials
        items={[{ quote: "Test quote", author: { name: "John" } }]}
      />,
    )
    expect(screen.getByText('"Test quote"')).toBeInTheDocument()
    expect(screen.getByText("John")).toBeInTheDocument()
  })
})
