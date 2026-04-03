import { render, screen } from "@testing-library/react"
import { MessageCircle } from "lucide-react"
import { describe, expect, it } from "vitest"

import { Features } from "./features"

describe("<Features />", async () => {
  it("renders", async () => {
    render(
      <Features>
        <Features.Item title="Feature title" icon={<MessageCircle />}>
          Feature paragraph
        </Features.Item>
      </Features>,
    )
    expect(screen.getByText("Feature title")).toBeInTheDocument()
    expect(screen.getByText("Feature paragraph")).toBeInTheDocument()
  })
})
