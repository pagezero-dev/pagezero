import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { ZodType } from "zod"

// biome-ignore lint/suspicious/noExplicitAny: matches TanStack useServerFn typing
type AnyServerFn = (...args: Array<any>) => Promise<any>

type UseFormActionResult<
  TData,
  TError,
  TOnMutateResult = unknown,
> = UseMutationResult<TData, TError, FormData, TOnMutateResult> & {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function useFormAction<
  TServerFn extends AnyServerFn,
  TSchema extends ZodType,
  TError = Error,
  TOnMutateResult = unknown,
>(
  serverFn: TServerFn,
  schema: TSchema,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<TServerFn>>,
      TError,
      FormData,
      TOnMutateResult
    >,
    "mutationFn"
  >,
): UseFormActionResult<
  Awaited<ReturnType<TServerFn>>,
  TError,
  TOnMutateResult
> {
  const runServerFn = useServerFn(serverFn) as unknown as (
    input: Parameters<TServerFn>[0],
  ) => ReturnType<TServerFn>

  const mutation = useMutation({
    ...options,
    mutationFn: (formData: FormData) =>
      runServerFn({
        data: schema.parse(Object.fromEntries(formData.entries())),
      }),
  })

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      mutation.mutate(new FormData(event.currentTarget))
    },
    [mutation.mutate],
  )

  return {
    ...mutation,
    onSubmit,
  }
}
