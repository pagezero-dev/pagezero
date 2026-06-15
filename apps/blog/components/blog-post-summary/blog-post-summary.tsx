import { User } from "lucide-react"
import type { BlogPostAuthor } from "@/blog/types"
import { Link } from "@/ui/link"
import { Heading, Muted, Small } from "@/ui/typography"
import { cn } from "@/ui/utils"

/** Stable across SSR and client; date-only frontmatter parses as UTC midnight */
function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

interface BlogPostSummaryBaseProps {
  title: string
  date: Date
  imgSrc: string
  author: BlogPostAuthor
}

type BlogPostSummaryProps =
  | (BlogPostSummaryBaseProps & { size?: "sm"; description: string })
  | (BlogPostSummaryBaseProps & { size: "lg"; description?: never })

function PostAuthor({
  author,
  linkName,
}: {
  author: BlogPostAuthor
  linkName: boolean
}) {
  return (
    <div className="flex items-center gap-4">
      {author.imageSrc ? (
        <img
          src={author.imageSrc}
          alt=""
          className="h-12 w-12 rounded-full border"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full border bg-muted">
          <User className="size-6 text-muted-foreground" />
        </div>
      )}
      <dl>
        <dt
          className={cn("font-semibold text-sm", linkName && "text-foreground")}
        >
          {linkName && author.url ? (
            <Link
              href={author.url}
              underline="hover"
              className="text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </dt>
        {author.role && (
          <dd>
            <Small className="text-muted-foreground">{author.role}</Small>
          </dd>
        )}
      </dl>
    </div>
  )
}

export const BlogPostSummary = ({
  title,
  date,
  imgSrc,
  author,
  ...props
}: BlogPostSummaryProps) => {
  const size = props.size ?? "sm"
  const description = size === "sm" ? props.description : undefined
  const isLarge = size === "lg"

  const Wrapper = isLarge ? "header" : "article"

  return (
    <Wrapper className={cn(isLarge ? "mb-12" : "flex max-w-sm flex-col gap-5")}>
      <img
        src={imgSrc}
        alt={title}
        className={cn(
          "aspect-video w-full rounded-xl border bg-muted object-cover",
          isLarge ? "mb-8" : "mb-4",
        )}
      />
      <time
        dateTime={date.toISOString()}
        className={cn(
          "text-muted-foreground text-sm",
          isLarge ? "mb-4 block" : "-mb-2",
        )}
      >
        {formatBlogDate(date)}
      </time>
      <Heading
        level={isLarge ? 1 : 3}
        className={cn(isLarge ? "mt-0 mb-6 text-foreground" : "my-0 text-xl")}
      >
        {title}
      </Heading>
      {description && <Muted className="leading-relaxed">{description}</Muted>}
      <PostAuthor author={author} linkName={isLarge} />
    </Wrapper>
  )
}

export type { BlogPostSummaryProps }
