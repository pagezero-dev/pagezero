import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Social } from "./social"

describe("<Social />", async () => {
  it("renders", async () => {
    render(
      <Social
        twitterUrl="https://www.twitter.com"
        githubUrl="https://www.github.com"
        youtubeUrl="https://www.youtube.com"
      />,
    )
    const element = screen.getByRole("link", { name: "YouTube" })
    expect(element).toBeInTheDocument()
  })
})
