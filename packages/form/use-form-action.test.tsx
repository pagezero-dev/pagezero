import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { useFormAction } from "./use-form-action"

vi.mock("@tanstack/react-start", () => ({
  useServerFn: <T,>(fn: T) => fn,
}))

const testSchema = z.object({
  email: z.string(),
  name: z.string(),
})

type Options = Parameters<typeof useFormAction>[2]

function renderFormAction(serverFn: () => Promise<unknown>, options?: Options) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return renderHook(() => useFormAction(serverFn, testSchema, options), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })
}

describe("useFormAction", () => {
  it("exposes field metadata from the schema with empty errors", () => {
    const serverFn = vi.fn().mockResolvedValue({ ok: true })

    const { result } = renderFormAction(serverFn)

    expect(result.current.fields).toEqual({
      email: { name: "email", errors: [] },
      name: { name: "name", errors: [] },
    })
  })

  it("submits FormData when onSubmit is called", async () => {
    const serverFn = vi.fn().mockResolvedValue({ ok: true })

    const { result } = renderFormAction(serverFn)

    const form = document.createElement("form")
    const emailInput = document.createElement("input")
    emailInput.name = "email"
    emailInput.value = "user@example.com"
    form.appendChild(emailInput)

    const nameInput = document.createElement("input")
    nameInput.name = "name"
    nameInput.value = "Jane Doe"
    form.appendChild(nameInput)

    const preventDefault = vi.fn()
    const event = {
      currentTarget: form,
      preventDefault,
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.onSubmit(event)
    })

    expect(preventDefault).toHaveBeenCalled()

    await waitFor(() => {
      expect(serverFn).toHaveBeenCalledWith({
        data: expect.any(FormData),
      })
    })

    const formData = serverFn.mock.calls[0]?.[0].data as FormData
    expect(formData.get("email")).toBe("user@example.com")
    expect(formData.get("name")).toBe("Jane Doe")
  })

  it("maps FormError field errors onto fields", async () => {
    const formError = {
      message: "Validation failed",
      fields: {
        email: ["Invalid email"],
      },
    }
    const serverFn = vi.fn().mockRejectedValue(formError)

    const { result } = renderFormAction(serverFn)

    act(() => {
      result.current.mutate(new FormData())
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(formError)
    })

    expect(result.current.fields.email.errors).toEqual(["Invalid email"])
    expect(result.current.fields.name.errors).toEqual([])
    expect(result.current.error?.message).toBe("Validation failed")
  })

  it("leaves field errors empty for non-FormError failures", async () => {
    const serverFn = vi.fn().mockRejectedValue(new Error("Server error"))

    const { result } = renderFormAction(serverFn)

    act(() => {
      result.current.mutate(new FormData())
    })

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
    })

    expect(result.current.fields.email.errors).toEqual([])
    expect(result.current.fields.name.errors).toEqual([])
    expect(result.current.error?.message).toBe("Server error")
  })

  it("forwards mutation options such as onSuccess", async () => {
    const onSuccess = vi.fn()
    const serverFn = vi.fn().mockResolvedValue({ ok: true })

    const { result } = renderFormAction(serverFn, { onSuccess })

    act(() => {
      result.current.mutate(new FormData())
    })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })

    expect(onSuccess.mock.calls[0]?.[0]).toEqual({ ok: true })
    expect(onSuccess.mock.calls[0]?.[1]).toBeInstanceOf(FormData)
  })
})
