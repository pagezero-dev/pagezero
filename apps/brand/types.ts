import { z } from "zod"

export const legalDocumentFrontmatterSchema = z.object({
  title: z.string(),
  date: z.iso.date(),
})
