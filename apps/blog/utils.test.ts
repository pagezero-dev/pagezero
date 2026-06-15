import { describe, expect, it } from "vitest"
import type { BlogPostFrontmatter, BlogPostMdxModule } from "./types"
import {
  getBlogPostModuleBySlug,
  getBlogPostSummaries,
  getBlogPostSummary,
  POST_PLACEHOLDER_IMG,
  resolveBlogImageSrc,
} from "./utils"

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

describe("resolveBlogImageSrc", () => {
  it("returns placeholder when imgSrc is undefined", () => {
    expect(resolveBlogImageSrc()).toBe(POST_PLACEHOLDER_IMG)
  })

  it("passes through resolved image URLs from MDX imports", () => {
    expect(resolveBlogImageSrc("/assets/test-cover.png")).toBe(
      "/assets/test-cover.png",
    )
  })

  it("passes through external URLs", () => {
    expect(resolveBlogImageSrc("https://example.com/cover.jpg")).toBe(
      "https://example.com/cover.jpg",
    )
  })
})

describe("getBlogPostSummary", () => {
  it("returns the post summary for a matching slug", () => {
    const modules = Object.fromEntries([
      mdx("./content/test.mdx", {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        imgSrc: "/assets/test-cover.png",
        author: { name: "PageZERO" },
      }),
    ])

    expect(getBlogPostSummary(modules, "test")).toEqual({
      slug: "test",
      title: "Test post",
      description: "Desc",
      date: new Date("2026-05-18").toISOString(),
      imgSrc: "/assets/test-cover.png",
      author: { name: "PageZERO" },
    })
  })

  it("returns null when slug does not match any post", () => {
    const modules = Object.fromEntries([
      mdx("./content/test.mdx", {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        author: { name: "PageZERO" },
      }),
    ])

    expect(getBlogPostSummary(modules, "unknown")).toBeNull()
  })
})

describe("getBlogPostModuleBySlug", () => {
  it("returns the MDX module for a matching slug", () => {
    const mod = {
      frontmatter: {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        author: { name: "PageZERO" },
      },
      default: () => null,
    }
    const modules = { "./content/test.mdx": mod }

    expect(getBlogPostModuleBySlug(modules, "test")).toBe(mod)
  })

  it("returns null when slug does not match any post", () => {
    const modules = Object.fromEntries([
      mdx("./content/test.mdx", {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        author: { name: "PageZERO" },
      }),
    ])

    expect(getBlogPostModuleBySlug(modules, "unknown")).toBeNull()
  })
})

describe("getBlogPostSummaries", () => {
  it("includes keywords when provided in frontmatter", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("./content/tagged.mdx", {
          title: "Tagged post",
          keywords: ["react", "cloudflare"],
        }),
      ]),
    })

    expect(posts[0]?.keywords).toEqual(["react", "cloudflare"])
  })

  it("maps frontmatter to summaries with slug from path", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("./content/hello-world.mdx", {
          title: "Hello world",
          description: "A short intro",
          date: "2026-05-18",
          imgSrc: "https://example.com/cover.jpg",
          author: { name: "Jane Doe", role: "Editor" },
        }),
      ]),
    })

    expect(posts).toEqual([
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

  it("extracts slug from Windows-style paths", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("apps\\blog\\content\\win-post.mdx", {
          title: "Windows path",
          description: "Desc",
          date: "2026-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
      ]),
    })

    expect(posts[0]?.slug).toBe("win-post")
  })

  it("skips modules without a parsable slug", () => {
    const posts = getBlogPostSummaries({
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

    expect(posts).toEqual([])
  })

  it("skips posts without a title", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([mdx("./content/no-title.mdx", { title: "" })]),
      "./content/missing-title.mdx": { default: () => null },
    })

    expect(posts).toEqual([])
  })

  it("applies defaults for missing optional frontmatter fields", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("./content/minimal.mdx", { title: "Minimal" }),
      ]),
    })

    expect(posts).toEqual([
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

  it("uses imgSrc from MDX frontmatter as-is", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("./content/local-cover.mdx", {
          title: "Local cover",
          imgSrc: "/assets/test-cover.png",
        }),
      ]),
    })

    expect(posts[0]?.imgSrc).toBe("/assets/test-cover.png")
  })

  it("falls back to epoch when date is invalid", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
        mdx("./content/bad-date.mdx", {
          title: "Bad date",
          description: "Desc",
          date: "not-a-date",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
      ]),
    })

    expect(posts[0]?.date).toBe(new Date(0).toISOString())
  })

  it("sorts posts by date descending", () => {
    const posts = getBlogPostSummaries({
      ...Object.fromEntries([
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
    })

    expect(posts.map((post) => post.slug)).toEqual(["newer", "older"])
  })
})
