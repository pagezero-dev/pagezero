import { describe, expect, it } from "vitest"
import { expiresInMinutes, isExpired } from "./expiration"

describe("expiresInMinutes", () => {
  it("returns a timestamp offset from the given date", () => {
    const from = new Date("2026-01-01T12:00:00.000Z")
    expect(expiresInMinutes(30, from)).toBe(
      new Date("2026-01-01T12:30:00.000Z").getTime(),
    )
  })
})

describe("isExpired", () => {
  it("returns true when the timestamp is in the past", () => {
    expect(isExpired(100, 200)).toBe(true)
  })

  it("returns false when the timestamp is in the future", () => {
    expect(isExpired(200, 100)).toBe(false)
  })
})
