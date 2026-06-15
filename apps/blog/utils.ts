import {
  type BlogPostFrontmatter,
  type BlogPostMdxModule,
  blogPostFrontmatterSchema,
} from "./types"

export function slugFromPostPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  return match?.[1]
}

export function toBlogPostFrontmatter(
  path: string,
  mod: BlogPostMdxModule,
): BlogPostFrontmatter | null {
  if (!slugFromPostPath(path)) return null

  return blogPostFrontmatterSchema.parse(mod.frontmatter)
}

export function getBlogPostFrontmatter(
  modules: Record<string, BlogPostMdxModule>,
  slug: string,
): BlogPostFrontmatter | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPostPath(path) === slug,
  )
  if (!entry) return null
  return toBlogPostFrontmatter(entry[0], entry[1])
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
