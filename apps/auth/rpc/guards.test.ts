import { redirect } from "@tanstack/react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const { mockServerFn } = await import("@/test/mock-server-fn")
  return {
    ...(await importOriginal<typeof import("@tanstack/react-start")>()),
    ...mockServerFn(),
  }
})

vi.mock("@/auth/session.server", () => ({
  useAppSession: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequestUrl: vi.fn(),
}))

vi.mock("../user.server", () => ({
  getUserId: vi.fn(),
}))

import { getRequestUrl } from "@tanstack/react-start/server"
import { useAppSession } from "@/auth/session.server"
import { getUserId } from "../user.server"
import { requireUserId } from "./guards"

describe("requireUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns userId when user is authenticated", async () => {
    vi.mocked(useAppSession).mockResolvedValue({
      data: { userId: "123" },
    } as Awaited<ReturnType<typeof useAppSession>>)
    vi.mocked(getUserId).mockResolvedValue(123)

    await expect(requireUserId()).resolves.toBe(123)
  })

  it("redirects to login with redirectTo to current path", async () => {
    vi.mocked(useAppSession).mockResolvedValue({
      data: {},
    } as Awaited<ReturnType<typeof useAppSession>>)
    vi.mocked(getUserId).mockResolvedValue(0)
    vi.mocked(getRequestUrl).mockReturnValue(
      new URL("http://test.com/test-path?query=123"),
    )

    await expect(requireUserId()).rejects.toEqual(
      redirect({
        to: "/login",
        search: { redirectTo: "/test-path?query=123" },
      }),
    )
  })

  it("redirects to login with provided redirectTo", async () => {
    vi.mocked(useAppSession).mockResolvedValue({
      data: {},
    } as Awaited<ReturnType<typeof useAppSession>>)
    vi.mocked(getUserId).mockResolvedValue(0)

    await expect(
      requireUserId({ data: { redirectTo: "/custom-path" } }),
    ).rejects.toEqual(
      redirect({
        to: "/login",
        search: { redirectTo: "/custom-path" },
      }),
    )
  })
})
