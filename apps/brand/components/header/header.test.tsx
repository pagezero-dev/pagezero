import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Header } from "./header"

describe("<Header />", async () => {
  it("renders", async () => {
    render(
      <Header logo={<h1>PageZERO</h1>}>
        <button type="button">About us</button>
      </Header>,
    )
    expect(screen.getByText("PageZERO")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "About us" })).toBeInTheDocument()
  })
})
