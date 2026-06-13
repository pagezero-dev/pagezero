import { describe, expect, it } from "vitest"
import { getRedirectUrl } from "./auth.server"

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
