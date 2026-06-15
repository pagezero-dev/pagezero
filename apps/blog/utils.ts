import type { BlogPostMdxModule, BlogPostSummary } from "./types"

export const POST_PLACEHOLDER_IMG =
  "https://placehold.co/800x450/e2e8f0/64748b?text=Post"

export function resolveBlogImageSrc(imgSrc?: string): string {
  return imgSrc ?? POST_PLACEHOLDER_IMG
}

function slugFromPostPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  return match?.[1]
}

export function toPostSummary(
  path: string,
  mod: BlogPostMdxModule,
): BlogPostSummary | null {
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
}

export function getBlogPostSummary(
  modules: Record<string, BlogPostMdxModule>,
  slug: string,
): BlogPostSummary | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPostPath(path) === slug,
  )
  if (!entry) return null
  return toPostSummary(entry[0], entry[1])
}

export function getBlogPostModuleBySlug(
  modules: Record<string, BlogPostMdxModule>,
  slug: string,
): BlogPostMdxModule | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPostPath(path) === slug,
  )
  return entry?.[1] ?? null
}
