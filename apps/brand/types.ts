import type { ComponentType } from "react"
import { z } from "zod"

export const legalDocumentFrontmatterSchema = z.object({
  title: z.string(),
  date: z.iso.date(),
})

export type LegalDocumentFrontmatter = z.infer<
  typeof legalDocumentFrontmatterSchema
>

export type LegalDocumentMdxModule = {
  frontmatter?: LegalDocumentFrontmatter
  default: ComponentType
}

export type LegalDocumentFrontmatterWithSlug = LegalDocumentFrontmatter & {
  slug: string
}
