import type { BlogPostMdxModule } from "./types"

export const postModules = import.meta.glob<BlogPostMdxModule>(
  "./content/*.mdx",
  {
    eager: true,
  },
)
