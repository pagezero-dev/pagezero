import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Button } from "@/ui/button"
import { Hero } from "./hero"

describe("<Hero />", async () => {
  it("renders", async () => {
    render(
      <Hero
        title="Test title"
        description="Test description"
        cta={
          <>
            <Button asChild>
              <a href="/get-started">Get started</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="/learn-more">Learn more →</a>
            </Button>
          </>
        }
      ></Hero>,
    )
    expect(
      screen.getByRole("heading", { name: "Test title" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Get started" }),
    ).toBeInTheDocument()
  })
})
