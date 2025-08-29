import { test, expect } from "@playwright/test"

test("has content", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Database says hello!")).toBeVisible()
})
