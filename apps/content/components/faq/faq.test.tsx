import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Faq } from "./faq"

describe("<Faq />", async () => {
  it("renders", async () => {
    render(
      <Faq
        items={[
          { question: "Question 1", answer: "Answer 1" },
          { question: "Question 2", answer: "Answer 2" },
          { question: "Question 3", answer: "Answer 3" },
        ]}
      />,
    )

    expect(screen.getByText("Question 1")).toBeInTheDocument()
    expect(screen.getByText("Answer 1")).toBeInTheDocument()
  })
})
