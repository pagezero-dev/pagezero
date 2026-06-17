import {
  type LegalDocumentFrontmatter,
  type LegalDocumentMdxModule,
  legalDocumentFrontmatterSchema,
} from "./types"

export function slugFromLegalPath(path: string): string | undefined {
  const match = /[/\\]([^/\\]+)\.mdx$/.exec(path)
  return match?.[1]
}

export function toLegalDocumentFrontmatter(
  path: string,
  mod: LegalDocumentMdxModule,
): LegalDocumentFrontmatter | null {
  if (!slugFromLegalPath(path)) return null

  return legalDocumentFrontmatterSchema.parse(mod.frontmatter)
}

export function getLegalDocumentFrontmatter(
  modules: Record<string, LegalDocumentMdxModule>,
  slug: string,
): LegalDocumentFrontmatter | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromLegalPath(path) === slug,
  )
  if (!entry) return null
  return toLegalDocumentFrontmatter(entry[0], entry[1])
}

export function getLegalDocumentModuleBySlug(
  modules: Record<string, LegalDocumentMdxModule>,
  slug: string,
): LegalDocumentMdxModule | null {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromLegalPath(path) === slug,
  )
  return entry?.[1] ?? null
}
