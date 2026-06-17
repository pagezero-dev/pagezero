import type { MdxModule } from "@/mdx"

export const postModules = import.meta.glob<MdxModule>("./content/*.mdx", {
  eager: true,
})
