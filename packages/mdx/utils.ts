import type { ComponentType } from "react"
import type { z } from "zod"

export type MdxModule = {
  frontmatter?: unknown
  default: ComponentType
}

export function slugFromMdxPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  return match?.[1]
}

export function getMdxModuleBySlug<T>(
  modules: Record<string, MdxModule>,
  schema: z.ZodType<T>,
  slug: string,
): (MdxModule & { frontmatter: T }) | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromMdxPath(path) === slug,
  )
  if (!entry) return null
  const [, mod] = entry
  return {
    ...mod,
    frontmatter: schema.parse(mod.frontmatter),
  }
}

export function getMdxFrontmatters<T>(
  modules: Record<string, MdxModule>,
  schema: z.ZodType<T>,
): (T & { slug: string })[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = slugFromMdxPath(path)
      if (!slug) return null
      const frontmatter = schema.parse(mod.frontmatter)
      return { ...frontmatter, slug }
    })
    .filter((item): item is T & { slug: string } => item !== null)
}
