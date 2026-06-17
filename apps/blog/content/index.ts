import { z } from "zod"
import type { MdxModule } from "@/mdx"

export const postModules = import.meta.glob<MdxModule>("./*.mdx", {
  eager: true,
})

export const blogPostAuthorSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  imageSrc: z.string().optional(),
  url: z.string().optional(),
})

export const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  date: z.iso.date(),
  imgSrc: z.string(),
  author: blogPostAuthorSchema,
})
