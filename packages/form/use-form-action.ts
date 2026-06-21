import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useMemo, useState } from "react"
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
  TResponse,
  TError,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TOnMutateResult = unknown,
> = Omit<
  UseMutationResult<TResponse, TError, FormData, TOnMutateResult>,
  "data" | "error"
> & {
  data: TResponse | undefined
  error: TError | null | undefined
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void
  fields: FormFields<TSchema>
}

type UseFormActionOptions<TResponse, TError, TOnMutateResult> = Omit<
  UseMutationOptions<TResponse, TError, FormData, TOnMutateResult>,
  "mutationFn"
>

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

function getFormFields<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  error: unknown,
): FormFields<TSchema> {
  const fieldErrors = isFormError<TSchema>(error) ? error.fields : undefined

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

  return fields
}

export function useFormAction<
  TResponse,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TError = Error | FormError<TSchema> | null,
  TOnMutateResult = unknown,
>(
  schema: TSchema,
  serverFn: FormActionServerFn<TResponse>,
  options?: UseFormActionOptions<TResponse, TError, TOnMutateResult>,
): UseFormActionResult<TResponse, TError, TSchema, TOnMutateResult> {
  const runServerFn = useServerFn(serverFn)
  const [data, setData] = useState<TResponse>()
  const [error, setError] = useState<TError | null>()

  const mutation = useMutation({
    ...options,
    mutationFn: (formData: FormData) => runServerFn({ data: formData }),
    onSettled: (data, error, ...rest) => {
      setData(data)
      setError(error)
      options?.onSettled?.(data, error, ...rest)
    },
  })

  return useMemo(() => {
    const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      mutation.mutate(new FormData(event.currentTarget))
    }

    const fields = getFormFields(schema, error)

    return {
      ...mutation,
      data,
      error,
      onSubmit,
      fields,
    }
  }, [mutation, schema, data, error])
}
