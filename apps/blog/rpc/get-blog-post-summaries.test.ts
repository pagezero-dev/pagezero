import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPostModules } = vi.hoisted(() => ({
  mockPostModules: {} as Record<string, import("../types").BlogPostMdxModule>,
}))

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const { mockServerFn } = await import("@/test/mock-server-fn")
  return {
    ...(await importOriginal<typeof import("@tanstack/react-start")>()),
    ...mockServerFn(),
  }
})

vi.mock("../post-modules", () => ({
  postModules: mockPostModules,
}))

import type { BlogPostFrontmatter, BlogPostMdxModule } from "../types"
import { getBlogPostSummaries } from "./get-blog-post-summaries"

function mdx(
  path: string,
  frontmatter: BlogPostFrontmatter,
): [string, BlogPostMdxModule] {
  return [
    path,
    {
      frontmatter,
      default: () => null,
    },
  ]
}

function validFrontmatter(
  overrides: Partial<BlogPostFrontmatter> = {},
): BlogPostFrontmatter {
  return {
    title: "Post title",
    description: "Post description",
    date: "2026-01-01",
    author: { name: "Author" },
    ...overrides,
  }
}

function setPostModules(modules: Record<string, BlogPostMdxModule>) {
  for (const key of Object.keys(mockPostModules)) {
    delete mockPostModules[key]
  }
  Object.assign(mockPostModules, modules)
}

describe("getBlogPostSummaries", () => {
  beforeEach(() => {
    setPostModules({})
  })

  it("includes keywords when provided in frontmatter", async () => {
    setPostModules(
      Object.fromEntries([
        mdx(
          "./content/tagged.mdx",
          validFrontmatter({
            title: "Tagged post",
            keywords: ["react", "cloudflare"],
          }),
        ),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.keywords).toEqual(["react", "cloudflare"])
  })

  it("maps frontmatter to summaries with slug from path", async () => {
    setPostModules(
      Object.fromEntries([
        mdx(
          "./content/hello-world.mdx",
          validFrontmatter({
            title: "Hello world",
            description: "A short intro",
            date: "2026-05-18",
            imgSrc: "https://example.com/cover.jpg",
            author: { name: "Jane Doe", role: "Editor" },
          }),
        ),
      ]),
    )

    await expect(getBlogPostSummaries()).resolves.toEqual([
      {
        slug: "hello-world",
        title: "Hello world",
        description: "A short intro",
        date: new Date("2026-05-18").toISOString(),
        imgSrc: "https://example.com/cover.jpg",
        author: { name: "Jane Doe", role: "Editor" },
      },
    ])
  })

  it("extracts slug from Windows-style paths", async () => {
    setPostModules(
      Object.fromEntries([
        mdx(
          "apps\\blog\\content\\win-post.mdx",
          validFrontmatter({
            title: "Windows path",
            description: "Desc",
            date: "2026-01-01",
            imgSrc: "https://example.com/a.jpg",
          }),
        ),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.slug).toBe("win-post")
  })

  it("skips modules without a parsable slug", async () => {
    setPostModules({
      "invalid-path": {
        frontmatter: validFrontmatter({ title: "Orphan" }),
        default: () => null,
      },
    })

    await expect(getBlogPostSummaries()).resolves.toEqual([])
  })

  it("throws when frontmatter is missing required fields", async () => {
    setPostModules({
      ...Object.fromEntries([
        mdx("./content/no-title.mdx", {
          title: "",
          description: "Desc",
          date: "2026-01-01",
          author: { name: "Author" },
        }),
      ]),
      "./content/missing-title.mdx": { default: () => null },
    })

    await expect(getBlogPostSummaries()).rejects.toThrow()
  })

  it("throws when required frontmatter fields are missing", async () => {
    setPostModules(
      Object.fromEntries([
        mdx("./content/minimal.mdx", {
          title: "Minimal",
        } as BlogPostFrontmatter),
      ]),
    )

    await expect(getBlogPostSummaries()).rejects.toThrow()
  })

  it("uses imgSrc from MDX frontmatter as-is", async () => {
    setPostModules(
      Object.fromEntries([
        mdx(
          "./content/local-cover.mdx",
          validFrontmatter({
            title: "Local cover",
            imgSrc: "/assets/test-cover.png",
          }),
        ),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.imgSrc).toBe("/assets/test-cover.png")
  })

  it("throws when date is not a valid ISO date", async () => {
    setPostModules({
      "./content/bad-date.mdx": {
        frontmatter: {
          title: "Bad date",
          description: "Desc",
          date: "not-a-date",
          author: { name: "Author" },
        } as BlogPostFrontmatter,
        default: () => null,
      },
    })

    await expect(getBlogPostSummaries()).rejects.toThrow()
  })

  it("sorts posts by date descending", async () => {
    setPostModules(
      Object.fromEntries([
        mdx(
          "./content/older.mdx",
          validFrontmatter({
            title: "Older",
            date: "2024-01-01",
            imgSrc: "https://example.com/a.jpg",
          }),
        ),
        mdx(
          "./content/newer.mdx",
          validFrontmatter({
            title: "Newer",
            date: "2026-06-01",
            imgSrc: "https://example.com/b.jpg",
          }),
        ),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts.map((post) => post.slug)).toEqual(["newer", "older"])
  })
})
