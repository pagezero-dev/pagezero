import type { ComponentType } from "react"
import { z } from "zod"

export const blogPostAuthorSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  imageSrc: z.string().optional(),
  url: z.string().optional(),
})

export type BlogPostAuthor = z.infer<typeof blogPostAuthorSchema>

export const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  /** ISO 8601 date string */
  date: z.string(),
  imgSrc: z.string().optional(),
  author: blogPostAuthorSchema,
})

export type BlogPostFrontmatter = z.infer<typeof blogPostFrontmatterSchema>

export type BlogPostMdxModule = {
  frontmatter?: BlogPostFrontmatter
  default: ComponentType
}

/** Frontmatter resolved to ISO dates + derived slug, safe for loader serialization */
export type BlogPostSummary = Omit<BlogPostFrontmatter, "imgSrc"> & {
  slug: string
  imgSrc: string
}
