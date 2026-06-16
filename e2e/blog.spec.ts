import { expect, test } from "@playwright/test"
import config from "@/config"

const welcomePost = {
  title: "Welcome to the blog",
  description:
    "An example blog post showing how to author content with MDX in this template.",
  slug: "welcome",
  author: "PageZERO",
}

test("blog index and post pages", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Blog" }).click()
  await page.waitForURL("/blog")

  await expect(
    page.getByRole("heading", { name: "Blog", exact: true }),
  ).toBeVisible()
  await expect(page.getByText(welcomePost.title)).toBeVisible()
  await expect(page.getByText(welcomePost.description)).toBeVisible()

  await page.getByRole("link").filter({ hasText: welcomePost.title }).click()
  await page.waitForURL(`/blog/${welcomePost.slug}`)

  await expect(page).toHaveTitle(
    `${welcomePost.title} - ${config.core.projectName}`,
  )
  await expect(
    page.getByRole("heading", { level: 1, name: welcomePost.title }),
  ).toBeVisible()
  await expect(
    page.getByText(welcomePost.author, { exact: true }),
  ).toBeVisible()
  await expect(page.getByText("What you get out of the box")).toBeVisible()
  await expect(page.getByRole("link", { name: "All posts" })).toBeVisible()

  await page.getByRole("link", { name: "All posts" }).click()
  await page.waitForURL("/blog")
  await expect(
    page.getByRole("heading", { name: "Blog", exact: true }),
  ).toBeVisible()
})

test("unknown blog post returns not found", async ({ page }) => {
  await page.goto("/blog/does-not-exist")
  await expect(page.getByText("Page not found")).toBeVisible()
})
