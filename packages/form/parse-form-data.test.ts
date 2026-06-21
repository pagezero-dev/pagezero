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

    expect(parseFormData(testSchema, formData)).toEqual({
      email: "user@example.com",
    })
  })

  it("throws when data is not FormData", () => {
    expect(() =>
      parseFormData(testSchema, {
        email: "user@example.com",
      } as unknown as FormData),
    ).toThrow("Expected FormData")
  })

  it("throws a FormError with the first issue message and field errors", () => {
    const formData = new FormData()
    const schema = z.object({
      email: z.string(),
      name: z.string(),
    })

    try {
      parseFormData(schema, formData)
      expect.unreachable("Expected parseFormData to throw")
    } catch (error) {
      expect(error).toEqual({
        message: "Invalid input: expected string, received undefined",
        fields: {
          email: ["Invalid input: expected string, received undefined"],
          name: ["Invalid input: expected string, received undefined"],
        },
      })
    }
  })

  it("includes per-field errors in FormError.fields", () => {
    const formData = new FormData()
    formData.set("email", "not-an-email")
    const schema = z.object({
      email: z.email(),
    })

    try {
      parseFormData(schema, formData)
      expect.unreachable("Expected parseFormData to throw")
    } catch (error) {
      expect(error).toMatchObject({
        message: expect.any(String),
        fields: {
          email: [expect.any(String)],
        },
      })
    }
  })
})
