import "./code-highlight.css"
import type { ComponentProps } from "react"
import { Link } from "@/ui/link"
import {
  Blockquote,
  Heading,
  InlineCode,
  List,
  P,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/typography"
import { cn } from "@/ui/utils"

function isBlockCode(className: string | undefined) {
  return /language-(\w+)/.test(className ?? "")
}

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <Heading
      level={1}
      className="mb-20 text-center text-foreground"
      {...props}
    />
  ),
  h2: (props: ComponentProps<"h2">) => <Heading level={2} {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading level={3} {...props} />,
  h4: (props: ComponentProps<"h4">) => <Heading level={4} {...props} />,
  h5: (props: ComponentProps<"h5">) => <Heading level={5} {...props} />,
  h6: (props: ComponentProps<"h6">) => <Heading level={6} {...props} />,
  p: (props: ComponentProps<"p">) => <P {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <Blockquote {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => <List {...props} />,
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <Link className={className} {...props} />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr className={cn("my-8 border-border", className)} {...props} />
  ),
  img: ({ className, alt = "", ...props }: ComponentProps<"img">) => (
    <img
      className={cn("my-6 rounded-lg border", className)}
      alt={alt}
      {...props}
    />
  ),
  code: ({ className, children, ...props }: ComponentProps<"code">) => {
    if (isBlockCode(className)) {
      return (
        <code className={cn("font-mono text-sm", className)} {...props}>
          {children}
        </code>
      )
    }

    return (
      <InlineCode className={className} {...props}>
        {children}
      </InlineCode>
    )
  },
  pre: ({ className, ...props }: ComponentProps<"pre">) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-foreground text-sm",
        className,
      )}
      {...props}
    />
  ),
  table: (props: ComponentProps<"table">) => <Table {...props} />,
  thead: (props: ComponentProps<"thead">) => <TableHeader {...props} />,
  tbody: (props: ComponentProps<"tbody">) => <TableBody {...props} />,
  tr: (props: ComponentProps<"tr">) => <TableRow {...props} />,
  th: (props: ComponentProps<"th">) => <TableHead {...props} />,
  td: (props: ComponentProps<"td">) => <TableCell {...props} />,
}
