import { expect, test } from "@playwright/test"
import type { DevelopmentEmailPayload } from "../apps/email/email.server"

test("newsletter double opt-in flow (dev email capture)", async ({ page }) => {
  const testEmail = `newsletter-e2e-${Date.now()}@example.com`

  await page.goto("/")

  await expect(page.getByPlaceholder("you@example.com")).toBeVisible()
  await expect(page.getByRole("button", { name: "Subscribe" })).toBeVisible()

  await page.getByPlaceholder("you@example.com").fill(testEmail)
  await page.getByRole("button", { name: "Subscribe" }).click()

  await expect(
    page.getByText("Check your email to confirm your subscription"),
  ).toBeVisible()

  const emails = (await page.evaluate(() =>
    fetch("/emails/sent").then((res) => res.json()),
  )) as DevelopmentEmailPayload[]

  const newsletterEmails = emails.filter((e) =>
    e.subject.toLowerCase().includes("newsletter"),
  )
  const lastEmail = newsletterEmails.at(-1)
  expect(lastEmail).toBeTruthy()
  if (!lastEmail) {
    throw new Error("Expected captured newsletter email")
  }

  const toField = Array.isArray(lastEmail.to)
    ? lastEmail.to.join(", ")
    : lastEmail.to
  expect(toField).toContain(testEmail)

  const urlMatches = [
    ...lastEmail.body.matchAll(/https?:\/\/[^\s<>"')]+/g),
  ].map((m) => m[0])
  const confirmUrlRaw = urlMatches.find((u) =>
    u.includes("/newsletter/confirm?"),
  )
  expect(confirmUrlRaw).toBeTruthy()
  if (!confirmUrlRaw) {
    throw new Error("Expected confirm link in dev email body")
  }

  const origin = new URL(page.url()).origin
  const confirmOnLocal = new URL(confirmUrlRaw)
  confirmOnLocal.protocol = new URL(origin).protocol
  confirmOnLocal.host = new URL(origin).host

  await page.goto(confirmOnLocal.toString())
  await expect(
    page.getByRole("heading", { name: "Newsletter", level: 2 }),
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Confirm subscription" }),
  ).toBeVisible()
})
