import { z } from "zod"
import type { MdxModule } from "@/mdx"

export const legalModules = import.meta.glob<MdxModule>("./legal/*.mdx", {
  eager: true,
})

export const legalDocumentFrontmatterSchema = z.object({
  title: z.string(),
  date: z.iso.date(),
})
