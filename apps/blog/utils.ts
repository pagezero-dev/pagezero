import {
  type BlogPostMdxModule,
  type BlogPostSummary,
  blogPostFrontmatterSchema,
} from "./types"

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

  const m = blogPostFrontmatterSchema.parse(mod.frontmatter)

  return {
    slug,
    title: m.title,
    description: m.description,
    ...(m.keywords?.length ? { keywords: m.keywords } : {}),
    date: new Date(m.date).toISOString(),
    imgSrc: m.imgSrc,
    author: m.author,
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
