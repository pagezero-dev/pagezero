import type { ReactNode } from "react"
import { Heading } from "@/ui/typography"

type ProseArticleProps = {
  children?: ReactNode
  title?: string
}

function ProseArticle({ children, title }: ProseArticleProps) {
  return (
    <article className="mx-auto max-w-prose px-5 py-32 text-muted-foreground">
      {title && (
        <Heading level={1} className="mb-20 text-center text-foreground">
          {title}
        </Heading>
      )}
      {children}
    </article>
  )
}

export { ProseArticle, type ProseArticleProps }
