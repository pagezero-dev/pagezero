import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PostCover } from "./post-cover"

describe("<PostCover />", () => {
  it("renders image with src and alt", () => {
    render(
      <PostCover src="/assets/test-cover-mock.png" alt="Test post cover" />,
    )

    const img = screen.getByRole("img", { name: "Test post cover" })
    expect(img).toHaveAttribute("src", "/assets/test-cover-mock.png")
  })
})
