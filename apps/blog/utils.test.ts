import { describe, expect, it } from "vitest"
import type { BlogPostFrontmatter, BlogPostMdxModule } from "./types"
import {
  getBlogPostModuleBySlug,
  getBlogPostSummary,
  POST_PLACEHOLDER_IMG,
  resolveBlogImageSrc,
  toPostSummary,
} from "./utils"

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

describe("toPostSummary", () => {
  it("throws when frontmatter is missing required fields", () => {
    expect(() =>
      toPostSummary("./content/invalid.mdx", { default: () => null }),
    ).toThrow()
  })
})

describe("getBlogPostSummary", () => {
  it("returns the post summary for a matching slug", () => {
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
