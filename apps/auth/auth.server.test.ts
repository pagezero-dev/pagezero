import { redirect } from "@tanstack/react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getRedirectUrl, requireUserId } from "./auth.server"

vi.mock("@/auth/session.server", () => ({
  useAppSession: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequestUrl: vi.fn(),
}))

vi.mock("@/user", () => ({
  getUserId: vi.fn(),
}))

import { useAppSession } from "@/auth/session.server"
import { getRequestUrl } from "@tanstack/react-start/server"
import { getUserId } from "@/user"

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
      requireUserId({ redirectTo: "/custom-path" }),
    ).rejects.toEqual(
      redirect({
        to: "/login",
        search: { redirectTo: "/custom-path" },
      }),
    )
  })
})

describe("getRedirectUrl", () => {
  it("should return the redirect url pathname with query params", () => {
    expect(getRedirectUrl("/test-path?query=123")).toBe("/test-path?query=123")
  })

  it("should return the redirect url pathname", () => {
    expect(getRedirectUrl("/test-path")).toBe("/test-path")
  })

  it("should return only the pathname if the redirectTo is a full url", () => {
    expect(getRedirectUrl("https://test.com/test-path")).toBe("/test-path")
  })

  it("should return only the pathname if the redirectTo is a full url with query params", () => {
    expect(getRedirectUrl("https://test.com/test-path?query=123")).toBe(
      "/test-path?query=123",
    )
  })
})
