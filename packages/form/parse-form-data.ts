import type { ZodType } from "zod"

export function formDataToObject(formData: FormData) {
  const data: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      data[key] = value
    }
  }

  return data
}

export function parseFormDataWithSchema<T>(
  formData: FormData,
  schema: ZodType<T>,
) {
  return { data: schema.parse(formDataToObject(formData)) }
}
