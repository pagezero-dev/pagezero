import { describe, expect, it } from "vitest"
import { getRedirectUrl, requireUserId } from "./auth.server"
import { createSessionStorage } from "./session.server"

describe("requireUserId", () => {
  const mockSessionCookieSecret = "test-secret"
  const mockUserId = 123
  const { getSession, commitSession } = createSessionStorage(
    mockSessionCookieSecret,
  )

  describe("when user is authenticated", () => {
    it("should return userId when user is authenticated", async () => {
      const session = await getSession()
      session.set("userId", mockUserId.toString())
      const cookieHeader = await commitSession(session)

      const request = new Request("http://test.com", {
        headers: {
          Cookie: cookieHeader,
        },
      })

      const result = await requireUserId(request, session)
      expect(result).toBe(mockUserId)
    })
  })

  describe("when user is not authenticated", () => {
    it("should redirect to login with redirectTo to current path", async () => {
      const request = new Request("http://test.com/test-path?query=123")
      const session = await getSession()
      await expect(requireUserId(request, session)).rejects.toThrow()
      const error = await requireUserId(request, session).catch((e) => e)
      expect(error.headers.get("location")).toBe(
        "/login?redirectTo=/test-path?query=123",
      )
      expect(error.status).toBe(302)
    })

    it("should redirect to login with provided redirectTo", async () => {
      const request = new Request("http://test.com/test-path")
      const customRedirectTo = "/custom-path"
      const session = await getSession()
      await expect(
        requireUserId(request, session, {
          redirectTo: customRedirectTo,
        }),
      ).rejects.toThrow()
      const error = await requireUserId(request, session, {
        redirectTo: customRedirectTo,
      }).catch((e) => e)
      expect(error.headers.get("location")).toBe(
        "/login?redirectTo=/custom-path",
      )
      expect(error.status).toBe(302)
    })

    it("should redirect to login with redirectTo to main page if no current path is available", async () => {
      const request = new Request("http://test.com")
      const session = await getSession()
      await expect(requireUserId(request, session)).rejects.toThrow()
      const error = await requireUserId(request, session).catch((e) => e)
      expect(error.headers.get("location")).toBe("/login?redirectTo=/")
      expect(error.status).toBe(302)
    })
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
