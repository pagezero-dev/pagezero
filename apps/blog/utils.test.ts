import { describe, expect, it } from "vitest"
import type { BlogPostFrontmatter, BlogPostMdxModule } from "./types"
import {
  getBlogPostFrontmatter,
  getBlogPostFrontmatters,
  getBlogPostModuleBySlug,
  toBlogPostFrontmatter,
} from "./utils"

function validFrontmatter(
  overrides: Partial<BlogPostFrontmatter> = {},
): BlogPostFrontmatter {
  return {
    title: "Post title",
    description: "Post description",
    date: "2026-01-01",
    imgSrc: "/assets/test-cover.png",
    author: { name: "Author" },
    ...overrides,
  }
}

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

describe("toBlogPostFrontmatter", () => {
  it("throws when frontmatter is missing required fields", () => {
    expect(() =>
      toBlogPostFrontmatter("./content/invalid.mdx", { default: () => null }),
    ).toThrow()
  })

  it("throws when imgSrc is missing", () => {
    expect(() =>
      toBlogPostFrontmatter("./content/missing-cover.mdx", {
        frontmatter: {
          title: "Post",
          description: "Desc",
          date: "2026-01-01",
          author: { name: "Author" },
        } as BlogPostFrontmatter,
        default: () => null,
      }),
    ).toThrow()
  })

  it("returns null when path has no parsable slug", () => {
    expect(
      toBlogPostFrontmatter("invalid-path", {
        frontmatter: validFrontmatter(),
        default: () => null,
      }),
    ).toBeNull()
  })
})

describe("getBlogPostFrontmatter", () => {
  it("returns frontmatter for a matching slug", () => {
    const modules = Object.fromEntries([
      mdx(
        "./content/test.mdx",
        validFrontmatter({
          title: "Test post",
          description: "Desc",
          date: "2026-05-18",
          imgSrc: "/assets/test-cover.png",
          author: { name: "PageZERO" },
        }),
      ),
    ])

    expect(getBlogPostFrontmatter(modules, "test")).toEqual({
      title: "Test post",
      description: "Desc",
      date: "2026-05-18",
      imgSrc: "/assets/test-cover.png",
      author: { name: "PageZERO" },
    })
  })

  it("returns null when slug does not match any post", () => {
    const modules = Object.fromEntries([
      mdx("./content/test.mdx", validFrontmatter({ title: "Test post" })),
    ])

    expect(getBlogPostFrontmatter(modules, "unknown")).toBeNull()
  })
})

describe("getBlogPostModuleBySlug", () => {
  it("returns the MDX module for a matching slug", () => {
    const mod = {
      frontmatter: validFrontmatter({
        title: "Test post",
        description: "Desc",
      }),
      default: () => null,
    }
    const modules = { "./content/test.mdx": mod }

    expect(getBlogPostModuleBySlug(modules, "test")).toBe(mod)
  })

  it("returns null when slug does not match any post", () => {
    const modules = Object.fromEntries([
      mdx("./content/test.mdx", validFrontmatter({ title: "Test post" })),
    ])

    expect(getBlogPostModuleBySlug(modules, "unknown")).toBeNull()
  })
})

describe("getBlogPostFrontmatters", () => {
  it("includes keywords when provided in frontmatter", () => {
    const modules = Object.fromEntries([
      mdx(
        "./content/tagged.mdx",
        validFrontmatter({
          title: "Tagged post",
          keywords: ["react", "cloudflare"],
        }),
      ),
    ])

    const posts = getBlogPostFrontmatters(modules)
    expect(posts[0]?.keywords).toEqual(["react", "cloudflare"])
  })

  it("maps frontmatter to summaries with slug from path", () => {
    const modules = Object.fromEntries([
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
    ])

    expect(getBlogPostFrontmatters(modules)).toEqual([
      {
        slug: "hello-world",
        title: "Hello world",
        description: "A short intro",
        date: "2026-05-18",
        imgSrc: "https://example.com/cover.jpg",
        author: { name: "Jane Doe", role: "Editor" },
      },
    ])
  })

  it("extracts slug from Windows-style paths", () => {
    const modules = Object.fromEntries([
      mdx(
        "apps\\blog\\content\\win-post.mdx",
        validFrontmatter({
          title: "Windows path",
          description: "Desc",
          date: "2026-01-01",
          imgSrc: "https://example.com/a.jpg",
        }),
      ),
    ])

    expect(getBlogPostFrontmatters(modules)[0]?.slug).toBe("win-post")
  })

  it("skips modules without a parsable slug", () => {
    const modules = {
      "invalid-path": {
        frontmatter: validFrontmatter({ title: "Orphan" }),
        default: () => null,
      },
    }

    expect(getBlogPostFrontmatters(modules)).toEqual([])
  })

  it("throws when frontmatter is missing required fields", () => {
    const modules = {
      ...Object.fromEntries([
        mdx(
          "./content/no-title.mdx",
          validFrontmatter({
            title: "",
            description: "Desc",
            date: "2026-01-01",
            author: { name: "Author" },
          }),
        ),
      ]),
      "./content/missing-title.mdx": { default: () => null },
    }

    expect(() => getBlogPostFrontmatters(modules)).toThrow()
  })

  it("throws when required frontmatter fields are missing", () => {
    const modules = Object.fromEntries([
      mdx("./content/minimal.mdx", {
        title: "Minimal",
      } as BlogPostFrontmatter),
    ])

    expect(() => getBlogPostFrontmatters(modules)).toThrow()
  })

  it("uses imgSrc from MDX frontmatter as-is", () => {
    const modules = Object.fromEntries([
      mdx(
        "./content/local-cover.mdx",
        validFrontmatter({
          title: "Local cover",
          imgSrc: "/assets/test-cover.png",
        }),
      ),
    ])

    expect(getBlogPostFrontmatters(modules)[0]?.imgSrc).toBe(
      "/assets/test-cover.png",
    )
  })

  it("throws when date is not a valid ISO date", () => {
    const modules = {
      "./content/bad-date.mdx": {
        frontmatter: {
          title: "Bad date",
          description: "Desc",
          date: "not-a-date",
          imgSrc: "/assets/test-cover.png",
          author: { name: "Author" },
        } as BlogPostFrontmatter,
        default: () => null,
      },
    }

    expect(() => getBlogPostFrontmatters(modules)).toThrow()
  })

  it("sorts posts by date descending", () => {
    const modules = Object.fromEntries([
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
    ])

    expect(getBlogPostFrontmatters(modules).map((post) => post.slug)).toEqual([
      "newer",
      "older",
    ])
  })
})
