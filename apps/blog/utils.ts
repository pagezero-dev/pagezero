import {
  type BlogPostFrontmatter,
  type BlogPostFrontmatterWithSlug,
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

export function getBlogPostFrontmatters(
  modules: Record<string, BlogPostMdxModule>,
): BlogPostFrontmatterWithSlug[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const frontmatter = toBlogPostFrontmatter(path, mod)
      const slug = slugFromPostPath(path)
      if (!frontmatter || !slug) return null
      return { ...frontmatter, slug }
    })
    .filter((post): post is BlogPostFrontmatterWithSlug => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
