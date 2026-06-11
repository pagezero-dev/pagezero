import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback, useMemo } from "react"
import type { z } from "zod"

export interface FormError<TSchema extends z.ZodType> {
  message: string
  fields: {
    [K in keyof z.infer<TSchema>]?: string[]
  }
}

type FormActionServerFn<TResponse> = (opts: {
  data: FormData
}) => Promise<TResponse>

type FormFields<TSchema extends z.ZodObject<z.ZodRawShape>> = {
  [K in keyof z.infer<TSchema>]: {
    name: K
    errors: string[]
  }
}

type UseFormActionResult<
  TData,
  TError,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TOnMutateResult = unknown,
> = UseMutationResult<TData, TError, FormData, TOnMutateResult> & {
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void
  fields: FormFields<TSchema>
}

function isFormError<TSchema extends z.ZodType>(
  error: unknown,
): error is FormError<TSchema> {
  return (
    typeof error === "object" &&
    error !== null &&
    "fields" in error &&
    "message" in error
  )
}

export function useFormAction<
  TResponse,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TError = Error | FormError<TSchema>,
  TOnMutateResult = unknown,
>(
  serverFn: FormActionServerFn<TResponse>,
  schema: TSchema,
  options?: Omit<
    UseMutationOptions<TResponse, TError, FormData, TOnMutateResult>,
    "mutationFn"
  >,
): UseFormActionResult<TResponse, TError, TSchema, TOnMutateResult> {
  const runServerFn = useServerFn(serverFn)

  const mutation = useMutation({
    ...options,
    mutationFn: (formData: FormData) => runServerFn({ data: formData }),
  })

  const onSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      mutation.mutate(new FormData(event.currentTarget))
    },
    [mutation.mutate],
  )

  return useMemo(() => {
    const fieldErrors = isFormError<TSchema>(mutation.error)
      ? mutation.error.fields
      : undefined

    const fields = Object.fromEntries(
      Object.keys(schema.shape).map((key) => {
        const fieldKey = key as keyof z.infer<TSchema> & string
        return [
          key,
          {
            name: fieldKey,
            errors: fieldErrors?.[fieldKey] ?? [],
          },
        ]
      }),
    ) as FormFields<TSchema>

    return {
      ...mutation,
      onSubmit,
      fields,
    }
  }, [mutation, onSubmit, schema, mutation.error])
}
