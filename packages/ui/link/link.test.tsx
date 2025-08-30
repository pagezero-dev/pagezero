import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Link } from "./link"

describe("<Link />", async () => {
  it("renders", async () => {
    render(<Link>Read more</Link>)
    const element = screen.getByText("Read more")
    expect(element).toBeInTheDocument()
  })
})
