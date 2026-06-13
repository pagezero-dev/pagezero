import type { MdxPostModule } from "./utils"

export const postModules = import.meta.glob<MdxPostModule>(
  "./routes/posts/*.mdx",
  {
    eager: true,
  },
)
