import { createServerFn } from "@tanstack/react-start"
import { postModules } from "../post-modules"
import type { BlogPostSummary } from "../types"
import { toBlogPostSummary } from "../utils"

export const getBlogPostSummaries = createServerFn({ method: "GET" }).handler(
  async () =>
    Object.entries(postModules)
      .map(([path, mod]) => toBlogPostSummary(path, mod))
      .filter((post): post is BlogPostSummary => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
)
