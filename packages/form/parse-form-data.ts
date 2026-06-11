import type { z } from "zod"

export function parseFormData<TSchema extends z.ZodType>(
  data: FormData,
  schema: TSchema,
): z.infer<TSchema> {
  if (!(data instanceof FormData)) {
    throw new TypeError("Expected FormData")
  }

  return schema.parse(Object.fromEntries(data.entries()))
}
