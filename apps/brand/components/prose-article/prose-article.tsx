import type { ReactNode } from "react"

import { Heading } from "@/ui/typography"

type ProseArticleProps = {
  children?: ReactNode
  title?: string
}

function ProseArticle({ children, title }: ProseArticleProps) {
  return (
    <article className="text-muted-foreground mx-auto box-content max-w-prose px-5 py-32">
      {title && (
        <Heading level={1} className="text-foreground mb-20 text-center">
          {title}
        </Heading>
      )}
      {children}
    </article>
  )
}

export { ProseArticle, type ProseArticleProps }
