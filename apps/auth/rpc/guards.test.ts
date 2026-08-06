import { redirect } from "@tanstack/react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const { mockServerFn } = await import("@/test/mock-server-fn")
  return {
    ...(await importOriginal<typeof import("@tanstack/react-start")>()),
    ...mockServerFn(),
  }
})

vi.mock("@tanstack/react-start/server", () => ({
  getRequestUrl: vi.fn(),
  getRequestHeaders: vi.fn(() => new Headers()),
}))

vi.mock("../auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

import { getRequestUrl } from "@tanstack/react-start/server"

import { auth } from "../auth.server"
import { requireUserId } from "./guards"

describe("requireUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns userId when user is authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-123" },
    } as Awaited<ReturnType<typeof auth.api.getSession>>)

    await expect(requireUserId()).resolves.toBe("user-123")
  })

  it("redirects to login with redirectTo to current path", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    vi.mocked(getRequestUrl).mockReturnValue(new URL("http://test.com/test-path?query=123"))

    await expect(requireUserId()).rejects.toEqual(
      redirect({
        to: "/login",
        search: { redirectTo: "/test-path?query=123" },
      }),
    )
  })

  it("redirects to login with provided redirectTo", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    await expect(requireUserId({ data: { redirectTo: "/custom-path" } })).rejects.toEqual(
      redirect({
        to: "/login",
        search: { redirectTo: "/custom-path" },
      }),
    )
  })
})
