import { test, expect } from "@playwright/test"

test("has content", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(
    page.getByRole("heading", { name: "Hello world!" }),
  ).toBeVisible()
})
