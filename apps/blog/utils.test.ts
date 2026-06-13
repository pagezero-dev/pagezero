import { describe, expect, it } from "vitest"
import {
  type BlogPostFrontmatter,
  buildPostSummaries,
  getPostSummaryByPathname,
  type MdxPostModule,
  POST_PLACEHOLDER_IMG,
  resolveBlogImageSrc,
} from "./utils"

function mdx(
  path: string,
  frontmatter: Partial<BlogPostFrontmatter> &
    Pick<BlogPostFrontmatter, "title">,
): [string, MdxPostModule] {
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

describe("getPostSummaryByPathname", () => {
  it("returns the post summary for a matching pathname", () => {
    const modules = Object.fromEntries([
      mdx("./routes/posts/test.mdx", {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        imgSrc: "/assets/test-cover.png",
        author: { name: "PageZERO" },
      }),
    ])

    expect(getPostSummaryByPathname(modules, "/blog/test")).toEqual({
      slug: "/blog/test",
      title: "Test post",
      description: "Desc",
      date: new Date("2026-05-18").toISOString(),
      imgSrc: "/assets/test-cover.png",
      author: { name: "PageZERO" },
    })
  })

  it("returns null when pathname does not match any post", () => {
    const modules = Object.fromEntries([
      mdx("./routes/posts/test.mdx", {
        title: "Test post",
        description: "Desc",
        date: "2026-05-18",
        author: { name: "PageZERO" },
      }),
    ])

    expect(getPostSummaryByPathname(modules, "/blog/unknown")).toBeNull()
  })
})

describe("buildPostSummaries", () => {
  it("includes keywords when provided in frontmatter", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/tagged.mdx", {
          title: "Tagged post",
          keywords: ["react", "cloudflare"],
        }),
      ]),
    })

    expect(posts[0]?.keywords).toEqual(["react", "cloudflare"])
  })

  it("maps frontmatter to summaries with slug from path", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/hello-world.mdx", {
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
        slug: "/blog/hello-world",
        title: "Hello world",
        description: "A short intro",
        date: new Date("2026-05-18").toISOString(),
        imgSrc: "https://example.com/cover.jpg",
        author: { name: "Jane Doe", role: "Editor" },
      },
    ])
  })

  it("extracts slug from Windows-style paths", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("apps\\blog\\routes\\posts\\win-post.mdx", {
          title: "Windows path",
          description: "Desc",
          date: "2026-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
      ]),
    })

    expect(posts[0]?.slug).toBe("/blog/win-post")
  })

  it("skips modules without a parsable slug", () => {
    const posts = buildPostSummaries({
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
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/no-title.mdx", { title: "" }),
      ]),
      "./routes/posts/missing-title.mdx": { default: () => null },
    })

    expect(posts).toEqual([])
  })

  it("applies defaults for missing optional frontmatter fields", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/minimal.mdx", { title: "Minimal" }),
      ]),
    })

    expect(posts).toEqual([
      {
        slug: "/blog/minimal",
        title: "Minimal",
        description: "Read the full post.",
        date: new Date(0).toISOString(),
        imgSrc: POST_PLACEHOLDER_IMG,
        author: { name: "PageZERO" },
      },
    ])
  })

  it("uses imgSrc from MDX frontmatter as-is", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/local-cover.mdx", {
          title: "Local cover",
          imgSrc: "/assets/test-cover.png",
        }),
      ]),
    })

    expect(posts[0]?.imgSrc).toBe("/assets/test-cover.png")
  })

  it("falls back to epoch when date is invalid", () => {
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/bad-date.mdx", {
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
    const posts = buildPostSummaries({
      ...Object.fromEntries([
        mdx("./routes/posts/older.mdx", {
          title: "Older",
          description: "Desc",
          date: "2024-01-01",
          imgSrc: "https://example.com/a.jpg",
          author: { name: "Author" },
        }),
        mdx("./routes/posts/newer.mdx", {
          title: "Newer",
          description: "Desc",
          date: "2026-06-01",
          imgSrc: "https://example.com/b.jpg",
          author: { name: "Author" },
        }),
      ]),
    })

    expect(posts.map((post) => post.slug)).toEqual([
      "/blog/newer",
      "/blog/older",
    ])
  })
})
