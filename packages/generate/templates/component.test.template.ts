export const componentTestTemplate = ({
  name,
  fileName,
}: {
  name: string
  fileName: string
}) => `

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { ${name} } from "./${fileName.toLowerCase()}"

describe("<${name} />", async () => {
  it("renders", async () => {
    const user = userEvent.setup()
    render(<${name} />)
    const element = screen.getByText("Test text")
    await user.click(element)
    expect(element).toBeInTheDocument()
  })
})
`
