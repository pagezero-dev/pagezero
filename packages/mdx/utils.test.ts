import { describe, expect, it } from "vitest"
import { z } from "zod"
import { getMdxFrontmatters, getMdxModuleBySlug, type MdxModule } from "./utils"

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.iso.date(),
  imgSrc: z.string(),
  author: z.object({ name: z.string() }),
  keywords: z.array(z.string()).optional(),
})

type Frontmatter = z.infer<typeof frontmatterSchema>

function validFrontmatter(overrides: Partial<Frontmatter> = {}): Frontmatter {
  return {
    title: "Post title",
    description: "Post description",
    date: "2026-01-01",
    imgSrc: "/assets/test-cover.png",
    author: { name: "Author" },
    ...overrides,
  }
}

function mdx(path: string, frontmatter: Frontmatter): [string, MdxModule] {
  return [
    path,
    {
      frontmatter,
      default: () => null,
    },
  ]
}

describe("getMdxModuleBySlug", () => {
  it("throws when frontmatter is missing required fields", () => {
    const modules = { "./content/invalid.mdx": { default: () => null } }

    expect(() =>
      getMdxModuleBySlug(modules, frontmatterSchema, "invalid"),
    ).toThrow()
  })

  it("throws when imgSrc is missing", () => {
    const modules = Object.fromEntries([
      mdx("./content/missing-cover.mdx", {
        title: "Post",
        description: "Desc",
        date: "2026-01-01",
        author: { name: "Author" },
      } as Frontmatter),
    ])

    expect(() =>
      getMdxModuleBySlug(modules, frontmatterSchema, "missing-cover"),
    ).toThrow()
  })

  it("returns the MDX module with parsed frontmatter for a matching slug", () => {
    const mod = {
      frontmatter: validFrontmatter({
        title: "Test post",
        description: "Desc",
      }),
      default: () => null,
    }
    const modules = { "./content/test.mdx": mod }

    expect(getMdxModuleBySlug(modules, frontmatterSchema, "test")).toEqual(mod)
  })

  it("returns parsed frontmatter for a matching slug", () => {
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

    expect(
      getMdxModuleBySlug(modules, frontmatterSchema, "test")?.frontmatter,
    ).toEqual({
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

    expect(getMdxModuleBySlug(modules, frontmatterSchema, "unknown")).toBeNull()
  })
})

describe("getMdxFrontmatters", () => {
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

    const posts = getMdxFrontmatters(modules, frontmatterSchema)
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
          author: { name: "Jane Doe" },
        }),
      ),
    ])

    expect(getMdxFrontmatters(modules, frontmatterSchema)).toEqual([
      {
        slug: "hello-world",
        title: "Hello world",
        description: "A short intro",
        date: "2026-05-18",
        imgSrc: "https://example.com/cover.jpg",
        author: { name: "Jane Doe" },
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

    expect(getMdxFrontmatters(modules, frontmatterSchema)[0]?.slug).toBe(
      "win-post",
    )
  })

  it("skips modules without a parsable slug", () => {
    const modules = {
      "invalid-path": {
        frontmatter: validFrontmatter({ title: "Orphan" }),
        default: () => null,
      },
    }

    expect(getMdxFrontmatters(modules, frontmatterSchema)).toEqual([])
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

    expect(() => getMdxFrontmatters(modules, frontmatterSchema)).toThrow()
  })

  it("throws when required frontmatter fields are missing", () => {
    const modules = Object.fromEntries([
      mdx("./content/minimal.mdx", {
        title: "Minimal",
      } as Frontmatter),
    ])

    expect(() => getMdxFrontmatters(modules, frontmatterSchema)).toThrow()
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

    expect(getMdxFrontmatters(modules, frontmatterSchema)[0]?.imgSrc).toBe(
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
        } as Frontmatter,
        default: () => null,
      },
    }

    expect(() => getMdxFrontmatters(modules, frontmatterSchema)).toThrow()
  })
})
