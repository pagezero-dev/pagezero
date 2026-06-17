import type { LegalDocumentMdxModule } from "./types"

export const legalModules = import.meta.glob<LegalDocumentMdxModule>(
  "./content/legal/*.mdx",
  {
    eager: true,
  },
)
