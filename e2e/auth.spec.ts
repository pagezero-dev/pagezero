import { expect, test } from "@playwright/test"
import type { DevelopmentEmailPayload } from "../apps/email/email.server"

test("basic authentication flow", async ({ page }) => {
  // Check initial state
  await page.goto("/")
  await page.getByRole("link", { name: "Log in" }).click()

  await expect(page.getByText("test@test.com")).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Logout" })).not.toBeVisible()

  // Check incorrect email
  await page.getByPlaceholder("Enter your email").click()
  await page.getByRole("button", { name: "Login" }).click()
  await expect(page.getByText("Email is required")).toBeVisible()

  // Login
  await page.getByPlaceholder("Enter your email").click()
  await page.getByPlaceholder("Enter your email").fill("test@test.com")
  await page.getByRole("button", { name: "Login" }).click()
  await page.getByPlaceholder("Verification code").click()

  // Check incorrect OTP
  await page.getByPlaceholder("Verification code").fill("123456")
  await page.getByRole("button", { name: "Verify" }).click()
  await expect(page.getByText("Invalid verification code")).toBeVisible()

  // Obtain OTP code from email
  const emails = (await page.evaluate(() =>
    fetch("/emails/sent").then((res) => res.json()),
  )) as DevelopmentEmailPayload[]
  const lastEmail = emails[emails.length - 1]
  const otpCodeFromEmail = lastEmail.body.match(
    /Verification code:\s+(\d{6})/,
  )?.[1]
  expect(otpCodeFromEmail).toMatch(/^\d{6}$/)

  // Provide OTP
  // biome-ignore lint/style/noNonNullAssertion: otpCodeFromEmail is not null at this point
  await page.getByPlaceholder("Verification code").fill(otpCodeFromEmail!)
  await page.getByRole("button", { name: "Verify" }).click()
  await page.waitForURL("/")
  await page.reload()

  // Check logged in state
  await expect(
    page.getByRole("button", { name: "test@test.com" }),
  ).toBeVisible()

  // Logout
  await page.getByRole("button", { name: "test@test.com" }).click()
  await page.getByRole("button", { name: "Logout" }).click()

  // Check logged out state
  await expect(page.getByText("test@test.com")).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible()
  await page.reload()
  await expect(page.getByText("test@test.com")).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible()
})
