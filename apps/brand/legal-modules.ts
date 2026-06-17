import type { MdxModule } from "@/mdx"

export const legalModules = import.meta.glob<MdxModule>(
  "./content/legal/*.mdx",
  {
    eager: true,
  },
)
