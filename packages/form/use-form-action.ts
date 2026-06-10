import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

type FormActionServerFn<TResponse> = (opts: {
  data: FormData
}) => Promise<TResponse>

type UseFormActionResult<
  TData,
  TError,
  TOnMutateResult = unknown,
> = UseMutationResult<TData, TError, FormData, TOnMutateResult> & {
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void
}

export function useFormAction<
  TResponse,
  TError = Error,
  TOnMutateResult = unknown,
>(
  serverFn: FormActionServerFn<TResponse>,
  options?: Omit<
    UseMutationOptions<TResponse, TError, FormData, TOnMutateResult>,
    "mutationFn"
  >,
): UseFormActionResult<TResponse, TError, TOnMutateResult> {
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

  return {
    ...mutation,
    onSubmit,
  }
}
