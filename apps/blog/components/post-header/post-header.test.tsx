import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PostHeader } from "./post-header"

describe("<PostHeader />", () => {
  it("renders title, date, and author", () => {
    render(
      <PostHeader
        title="Test post"
        date={new Date("2026-05-18")}
        imgSrc="/assets/test-cover.png"
        author={{ name: "PageZERO" }}
      />,
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Test post" }),
    ).toBeInTheDocument()
    expect(screen.getByText("PageZERO")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Test post" })).toBeInTheDocument()
  })

  it("links author name when url is provided", () => {
    render(
      <PostHeader
        title="Test post"
        date={new Date("2026-05-18")}
        imgSrc="/assets/test-cover.png"
        author={{
          name: "Jane Doe",
          url: "https://x.com/janedoe",
        }}
      />,
    )

    const link = screen.getByRole("link", { name: "Jane Doe" })
    expect(link).toHaveAttribute("href", "https://x.com/janedoe")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})
