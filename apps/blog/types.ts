import type { ComponentType } from "react"

export type BlogPostAuthor = {
  name: string
  role?: string
  imageSrc?: string
  url?: string
}

export type BlogPostFrontmatter = {
  title: string
  description: string
  keywords?: string[]
  /** ISO 8601 date string */
  date: string
  imgSrc?: string
  author: BlogPostAuthor
}

export type BlogPostMdxModule = {
  frontmatter?: BlogPostFrontmatter
  default: ComponentType
}

/** Frontmatter resolved to ISO dates + derived slug, safe for loader serialization */
export type BlogPostSummary = Omit<BlogPostFrontmatter, "imgSrc"> & {
  slug: string
  imgSrc: string
}
