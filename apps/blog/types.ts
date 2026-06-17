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
  date: z.iso.date(),
  imgSrc: z.string(),
  author: blogPostAuthorSchema,
})

export type BlogPostFrontmatterWithSlug = z.infer<
  typeof blogPostFrontmatterSchema
> & {
  slug: string
}
