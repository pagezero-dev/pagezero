import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { RadioGroup, RadioGroupItem } from "./radio-group"

describe("<RadioGroup />", () => {
  it("renders and allows selection", async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>,
    )

    const option1 = screen.getByLabelText("Option 1")
    const option2 = screen.getByLabelText("Option 2")

    expect(option1).toBeChecked()
    expect(option2).not.toBeChecked()

    await user.click(option2)
    expect(option1).not.toBeChecked()
    expect(option2).toBeChecked()
  })
})
