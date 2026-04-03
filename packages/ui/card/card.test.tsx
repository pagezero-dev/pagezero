import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

describe("<Card />", () => {
  it("renders card with basic structure", () => {
    render(
      <Card data-testid="test-card">
        <CardContent>Test content</CardContent>
      </Card>,
    )

    const content = screen.getByText("Test content")
    expect(content).toHaveAttribute("data-slot", "card-content")

    const card = screen.getByTestId("test-card")
    expect(card).toHaveAttribute("data-slot", "card")
  })

  it("renders complete card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>Full card example</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer section</CardFooter>
      </Card>,
    )

    expect(screen.getByText("Complete Card")).toBeInTheDocument()
    expect(screen.getByText("Full card example")).toBeInTheDocument()
    expect(screen.getByText("Action")).toBeInTheDocument()
    expect(screen.getByText("Main content")).toBeInTheDocument()
    expect(screen.getByText("Footer section")).toBeInTheDocument()
  })
})
