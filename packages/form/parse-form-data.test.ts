import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseFormData } from "./parse-form-data"

const testSchema = z.object({
  email: z.string(),
  otp: z.string().optional(),
})

describe("parseFormData", () => {
  it("parses FormData entries with the provided schema", () => {
    const formData = new FormData()
    formData.set("email", "user@example.com")

    expect(parseFormData(formData, testSchema)).toEqual({
      email: "user@example.com",
    })
  })

  it("throws when data is not FormData", () => {
    expect(() =>
      parseFormData(
        { email: "user@example.com" } as unknown as FormData,
        testSchema,
      ),
    ).toThrow("Expected FormData")
  })

  it("throws the first validation error", () => {
    const formData = new FormData()
    const schema = z.object({
      email: z.string(),
      name: z.string(),
    })

    expect(() => parseFormData(formData, schema)).toThrow(
      "Invalid input: expected string, received undefined",
    )
  })
})
