import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { PostSummary } from "./post-summary"

describe("<PostSummary />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(
      <PostSummary
        title="First post"
        author={{ name: "John Doe" }}
        description="Post description"
        date={new Date()}
        imgSrc="https://example.com/image.jpg"
      />,
    )
    const element = screen.getByText("Post description")
    await user.click(element)
    expect(element).toBeInTheDocument()
  })

  it("renders author name as plain text when url is provided", () => {
    render(
      <PostSummary
        title="First post"
        author={{
          name: "Jane Doe",
          url: "https://x.com/janedoe",
        }}
        description="Post description"
        date={new Date()}
        imgSrc="https://example.com/image.jpg"
      />,
    )

    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Jane Doe" }),
    ).not.toBeInTheDocument()
  })
})
