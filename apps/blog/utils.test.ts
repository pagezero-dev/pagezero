import { describe, expect, it } from "vitest"
import type { BlogPostFrontmatter, BlogPostMdxModule } from "./types"
import {
  getBlogPostModuleBySlug,
  getBlogPostSummary,
  toBlogPostSummary,
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

describe("toBlogPostSummary", () => {
  it("throws when frontmatter is missing required fields", () => {
    expect(() =>
      toBlogPostSummary("./content/invalid.mdx", { default: () => null }),
    ).toThrow()
  })

  it("throws when imgSrc is missing", () => {
    expect(() =>
      toBlogPostSummary("./content/missing-cover.mdx", {
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
      mdx("./content/test.mdx", validFrontmatter({ title: "Test post" })),
    ])

    expect(getBlogPostSummary(modules, "unknown")).toBeNull()
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
