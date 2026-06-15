import { createServerFn } from "@tanstack/react-start"
import { postModules } from "../post-modules"
import type { BlogPostSummary } from "../types"
import { slugFromPostPath, toBlogPostFrontmatter } from "../utils"

export const getBlogPostSummaries = createServerFn({ method: "GET" }).handler(
  async () =>
    Object.entries(postModules)
      .map(([path, mod]) => {
        const frontmatter = toBlogPostFrontmatter(path, mod)
        const slug = slugFromPostPath(path)
        if (!frontmatter || !slug) return null
        return { ...frontmatter, slug }
      })
      .filter((post): post is BlogPostSummary => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
)
