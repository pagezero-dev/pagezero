import type { BlogPostMdxModule } from "./utils"

export const postModules = import.meta.glob<BlogPostMdxModule>(
  "./content/*.mdx",
  {
    eager: true,
  },
)
