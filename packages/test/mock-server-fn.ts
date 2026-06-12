/**
 * Replaces `createServerFn` so server functions run their handler in-process
 * during tests, bypassing the request/response layer.
 *
 * Use inside `vi.mock("@tanstack/react-start", ...)`:
 *
 * ```ts
 * vi.mock("@tanstack/react-start", async (importOriginal) => ({
 *   ...(await importOriginal<typeof import("@tanstack/react-start")>()),
 *   ...mockServerFn(),
 * }))
 * ```
 */
export function mockServerFn() {
  const createServerFn = () => {
    const builder = {
      validator: () => builder,
      handler:
        <TData, TResult>(handler: (ctx: { data: TData }) => TResult) =>
        (opts?: { data: TData }) =>
          handler({ data: opts?.data as TData }),
    }
    return builder
  }

  return { createServerFn }
}
