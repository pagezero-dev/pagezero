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
import { POST_PLACEHOLDER_IMG } from "../utils"
import { getBlogPostSummaries } from "./get-blog-post-summaries"

function mdx(
  path: string,
  frontmatter: Partial<BlogPostFrontmatter> &
    Pick<BlogPostFrontmatter, "title">,
): [string, BlogPostMdxModule] {
  return [
    path,
    {
      frontmatter: frontmatter as BlogPostFrontmatter,
      default: () => null,
    },
  ]
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
        mdx("./content/tagged.mdx", {
          title: "Tagged post",
          keywords: ["react", "cloudflare"],
        }),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.keywords).toEqual(["react", "cloudflare"])
  })

  it("maps frontmatter to summaries with slug from path", async () => {
    setPostModules(
      Object.fromEntries([
        mdx("./content/hello-world.mdx", {
          title: "Hello world",
          description: "A short intro",
          date: "2026-05-18",
          imgSrc: "https://example.com/cover.jpg",
          author: { name: "Jane Doe", role: "Editor" },
        }),
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
        mdx("apps\\blog\\content\\win-post.mdx", {
          title: "Windows path",
          description: "Desc",
          date: "2026-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.slug).toBe("win-post")
  })

  it("skips modules without a parsable slug", async () => {
    setPostModules({
      "invalid-path": {
        frontmatter: {
          title: "Orphan",
          description: "Desc",
          date: "2026-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        },
        default: () => null,
      },
    })

    await expect(getBlogPostSummaries()).resolves.toEqual([])
  })

  it("skips posts without a title", async () => {
    setPostModules({
      ...Object.fromEntries([mdx("./content/no-title.mdx", { title: "" })]),
      "./content/missing-title.mdx": { default: () => null },
    })

    await expect(getBlogPostSummaries()).resolves.toEqual([])
  })

  it("applies defaults for missing optional frontmatter fields", async () => {
    setPostModules(
      Object.fromEntries([mdx("./content/minimal.mdx", { title: "Minimal" })]),
    )

    await expect(getBlogPostSummaries()).resolves.toEqual([
      {
        slug: "minimal",
        title: "Minimal",
        description: "Read the full post.",
        date: new Date(0).toISOString(),
        imgSrc: POST_PLACEHOLDER_IMG,
        author: { name: "PageZERO" },
      },
    ])
  })

  it("uses imgSrc from MDX frontmatter as-is", async () => {
    setPostModules(
      Object.fromEntries([
        mdx("./content/local-cover.mdx", {
          title: "Local cover",
          imgSrc: "/assets/test-cover.png",
        }),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.imgSrc).toBe("/assets/test-cover.png")
  })

  it("falls back to epoch when date is invalid", async () => {
    setPostModules(
      Object.fromEntries([
        mdx("./content/bad-date.mdx", {
          title: "Bad date",
          description: "Desc",
          date: "not-a-date",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts[0]?.date).toBe(new Date(0).toISOString())
  })

  it("sorts posts by date descending", async () => {
    setPostModules(
      Object.fromEntries([
        mdx("./content/older.mdx", {
          title: "Older",
          description: "Desc",
          date: "2024-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
        mdx("./content/newer.mdx", {
          title: "Newer",
          description: "Desc",
          date: "2026-06-01",
          imgSrc: "https://example.com/b.jpg",
          author: { name: "Author" },
        }),
      ]),
    )

    const posts = await getBlogPostSummaries()
    expect(posts.map((post) => post.slug)).toEqual(["newer", "older"])
  })
})
