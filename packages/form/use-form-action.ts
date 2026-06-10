import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query"
import { type RequiredFetcher, useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

// biome-ignore lint/suspicious/noExplicitAny: TanStack Fetcher generics
type FormActionServerFn = RequiredFetcher<any, any, any>

type UseFormActionResult<
  TData,
  TError,
  TOnMutateResult = unknown,
> = UseMutationResult<TData, TError, FormData, TOnMutateResult> & {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function useFormAction<
  TServerFn extends FormActionServerFn,
  TError = Error,
  TOnMutateResult = unknown,
>(
  serverFn: TServerFn,
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
  const runServerFn = useServerFn(serverFn) as unknown as (input: {
    data: FormData
  }) => Promise<Awaited<ReturnType<TServerFn>>>

  const mutation = useMutation({
    ...options,
    mutationFn: (formData: FormData) => runServerFn({ data: formData }),
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
