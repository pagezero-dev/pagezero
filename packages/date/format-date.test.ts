import { describe, expect, it } from "vitest"
import { formatDate } from "./format-date"

describe("formatDate", () => {
  it("formats a UTC date-only value", () => {
    const date = new Date("2026-01-15T00:00:00.000Z")
    expect(formatDate(date)).toBe("Jan 15, 2026")
  })

  it("supports custom locale and time zone", () => {
    const date = new Date("2026-01-15T23:00:00.000Z")
    expect(
      formatDate(date, { locale: "en-GB", timeZone: "Europe/Warsaw" }),
    ).toBe("16 Jan 2026")
  })
})
