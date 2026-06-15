import { describe, expect, it } from "vitest"
import type { BlogPostFrontmatter, BlogPostMdxModule } from "./types"
import {
  getBlogPostFrontmatter,
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
