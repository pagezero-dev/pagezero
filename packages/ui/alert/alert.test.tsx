import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Alert, AlertDescription, AlertTitle } from "./alert"

describe("<Alert />", () => {
  it("renders with title and description", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>,
    )

    expect(screen.getByText("Alert Title")).toBeInTheDocument()
    expect(screen.getByText("Alert Description")).toBeInTheDocument()
  })
})
