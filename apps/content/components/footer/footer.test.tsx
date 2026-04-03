import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Footer } from "./footer"

describe("<Footer />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(
      <Footer
        companyName="Test Company"
        navigation={[
          {
            heading: "Title",
            children: [{ label: "About us", href: "/about-us" }],
          },
        ]}
      />,
    )
    const element = screen.getByText("Title")
    await user.click(element)
    expect(element).toBeInTheDocument()
  })
})
