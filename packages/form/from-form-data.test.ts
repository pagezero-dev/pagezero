import { describe, expect, it } from "vitest"
import { fromFormData } from "./from-form-data"

describe("fromFormData", () => {
  it("converts FormData entries into a plain object", () => {
    const formData = new FormData()
    formData.set("email", "user@example.com")

    expect(fromFormData(formData)).toEqual({
      email: "user@example.com",
    })
  })

  it("throws when data is not FormData", () => {
    expect(() => fromFormData({ email: "user@example.com" })).toThrow(
      "Expected FormData",
    )
  })
})
