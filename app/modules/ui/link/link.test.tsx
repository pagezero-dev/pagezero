import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Link } from "./link"

describe("<Link />", async () => {
  it("renders", async () => {
    render(<Link>Read more</Link>)
    const element = screen.getByText("Read more")
    expect(element).toBeInTheDocument()
  })
})
