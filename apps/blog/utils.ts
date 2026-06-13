import type { ComponentType } from "react"

export type BlogPostAuthor = {
  name: string
  role?: string
  imageSrc?: string
  url?: string
}

export type BlogPostFrontmatter = {
  title: string
  description: string
  keywords?: string[]
  /** ISO 8601 date string */
  date: string
  imgSrc?: string
  author: BlogPostAuthor
}

export type MdxPostModule = {
  frontmatter?: BlogPostFrontmatter
  default: ComponentType
}

/** Frontmatter resolved to ISO dates + derived slug, safe for loader serialization */
export type BlogPostSummary = Omit<BlogPostFrontmatter, "imgSrc"> & {
  slug: string
  imgSrc: string
}

export const POST_PLACEHOLDER_IMG =
  "https://placehold.co/800x450/e2e8f0/64748b?text=Post"

export function resolveBlogImageSrc(imgSrc?: string): string {
  return imgSrc ?? POST_PLACEHOLDER_IMG
}

function slugFromPostPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  const basename = match?.[1]
  if (!basename) return undefined
  return `/blog/${basename}`
}

export function buildPostSummaries(
  modules: Record<string, MdxPostModule>,
): BlogPostSummary[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = slugFromPostPath(path)
      if (!slug) return null

      const m = mod.frontmatter
      if (!m?.title) return null

      const dateIso = (() => {
        if (!m.date) return new Date(0).toISOString()
        const parsed = new Date(m.date)
        return Number.isNaN(parsed.getTime())
          ? new Date(0).toISOString()
          : parsed.toISOString()
      })()

      return {
        slug,
        title: m.title,
        description: m.description ?? "Read the full post.",
        ...(m.keywords?.length ? { keywords: m.keywords } : {}),
        date: dateIso,
        imgSrc: resolveBlogImageSrc(m.imgSrc),
        author: m.author ?? { name: "PageZERO" },
      }
    })
    .filter((post): post is BlogPostSummary => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostSummaryByPathname(
  modules: Record<string, MdxPostModule>,
  pathname: string,
): BlogPostSummary | null {
  return (
    buildPostSummaries(modules).find((post) => post.slug === pathname) ?? null
  )
}

export function getPostModuleBySlug(
  modules: Record<string, MdxPostModule>,
  slug: string,
): MdxPostModule | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPostPath(path) === slug,
  )
  return entry?.[1] ?? null
}
