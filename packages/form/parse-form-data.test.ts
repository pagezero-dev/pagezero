import { describe, expect, it } from "vitest"
import { z } from "zod"
import { formDataToObject, parseFormDataWithSchema } from "./parse-form-data"

describe("formDataToObject", () => {
  it("converts form fields into a plain object", () => {
    const formData = new FormData()
    formData.set("email", "user@example.com")
    formData.set("redirectTo", "/")

    expect(formDataToObject(formData)).toEqual({
      email: "user@example.com",
      redirectTo: "/",
    })
  })
})

describe("parseFormDataWithSchema", () => {
  it("parses form data with a zod schema", () => {
    const schema = z.object({
      email: z.string(),
      redirectTo: z.string().optional(),
    })
    const formData = new FormData()
    formData.set("email", "user@example.com")
    formData.set("redirectTo", "/")

    expect(parseFormDataWithSchema(formData, schema)).toEqual({
      data: {
        email: "user@example.com",
        redirectTo: "/",
      },
    })
  })
})
