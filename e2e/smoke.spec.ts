import { test, expect } from "@playwright/test"

test("has content", async ({ page }) => {
  expect(
    process.env.TEST_PAGE_URL,
    "Missing test page url: process.env.TEST_PAGE_URL",
  ).toBeTruthy()
  if (
    process.env.CLOUDFLARE_ACCESS_CLIENT_SECRET &&
    process.env.CLOUDFLARE_ACCESS_CLIENT_ID
  ) {
    await page.setExtraHTTPHeaders({
      "CF-Access-Client-Id": process.env.CLOUDFLARE_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": process.env.CLOUDFLARE_ACCESS_CLIENT_SECRET,
    })
  }
  const response = await page.goto(process.env.TEST_PAGE_URL || "")
  expect(response?.ok).toBeTruthy()
  await expect(page.getByText("PageZERO")).toBeVisible()
})
