import type { MdxPostModule } from "./utils"

export const postModules = import.meta.glob<MdxPostModule>(
  "./content/*.mdx",
  {
    eager: true,
  },
)
