import { expect, test } from "@playwright/test"
import config from "@/config"

test("has content on home page", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Your Product Tagline Here")).toBeVisible()
  await expect(page).toHaveTitle(config.core.appTitle)
})
