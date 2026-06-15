import {
  type BlogPostMdxModule,
  type BlogPostSummary,
  blogPostFrontmatterSchema,
} from "./types"

function slugFromPostPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  return match?.[1]
}

export function toBlogPostSummary(
  path: string,
  mod: BlogPostMdxModule,
): BlogPostSummary | null {
  const slug = slugFromPostPath(path)
  if (!slug) return null

  const m = blogPostFrontmatterSchema.parse(mod.frontmatter)

  return {
    ...m,
    slug,
    date: new Date(m.date).toISOString(),
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
  return toBlogPostSummary(entry[0], entry[1])
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
