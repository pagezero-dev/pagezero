import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { BlogPostSummary } from "./blog-post-summary"

const baseProps = {
  title: "Test post",
  date: new Date("2026-05-18"),
  imgSrc: "/assets/test-cover.png",
  author: { name: "PageZERO" },
} as const

describe("<BlogPostSummary />", () => {
  describe("size sm", () => {
    it("renders description", async () => {
      const user = userEvent.setup()
      render(<BlogPostSummary {...baseProps} description="Post description" />)
      const element = screen.getByText("Post description")
      await user.click(element)
      expect(element).toBeInTheDocument()
    })

    it("renders author name as plain text when url is provided", () => {
      render(
        <BlogPostSummary
          {...baseProps}
          description="Post description"
          author={{
            name: "Jane Doe",
            url: "https://x.com/janedoe",
          }}
        />,
      )

      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
      expect(
        screen.queryByRole("link", { name: "Jane Doe" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("size lg", () => {
    it("renders title, date, and author", () => {
      render(<BlogPostSummary {...baseProps} size="lg" />)

      expect(
        screen.getByRole("heading", { level: 1, name: "Test post" }),
      ).toBeInTheDocument()
      expect(screen.getByText("PageZERO")).toBeInTheDocument()
      expect(screen.getByRole("img", { name: "Test post" })).toBeInTheDocument()
    })

    it("links author name when url is provided", () => {
      render(
        <BlogPostSummary
          {...baseProps}
          size="lg"
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
})
