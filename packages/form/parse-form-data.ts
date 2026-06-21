import { z } from "zod"
import type { FormError } from "./use-form-action"

z.config(z.locales.en())

export function parseFormData<TSchema extends z.ZodType>(
  schema: TSchema,
  data: FormData,
): z.infer<TSchema> {
  if (!(data instanceof FormData)) {
    throw new TypeError("Expected FormData")
  }

  const result = schema.safeParse(Object.fromEntries(data.entries()))
  if (!result.success) {
    throw {
      message: result.error.issues[0]?.message ?? "Validation failed",
      fields: result.error?.flatten().fieldErrors ?? {},
    } satisfies FormError<TSchema>
  }

  return result.data
}
