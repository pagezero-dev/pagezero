import type { z } from "zod"

export function parseFormData<TSchema extends z.ZodType>(
  data: FormData,
  schema: TSchema,
): z.infer<TSchema> {
  if (!(data instanceof FormData)) {
    throw new TypeError("Expected FormData")
  }

  const result = schema.safeParse(Object.fromEntries(data.entries()))
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Validation failed")
  }

  return result.data
}
