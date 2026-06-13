import { User } from "lucide-react"
import { PostCover } from "@/blog/components/post-cover"
import type { BlogPostAuthor } from "@/blog/utils"
import { Heading, Muted, Small } from "@/ui/typography"

/** Stable across SSR and client; date-only frontmatter parses as UTC midnight */
function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

interface PostSummaryProps {
  title: string
  description: string
  date: Date
  imgSrc: string
  author: BlogPostAuthor
}

export const PostSummary = ({
  title,
  description,
  date,
  imgSrc,
  author,
}: PostSummaryProps) => {
  return (
    <article className="flex max-w-sm flex-col gap-5">
      <PostCover src={imgSrc} alt={title} className="mb-4" />
      <time
        dateTime={date.toISOString()}
        className="-mb-2 text-muted-foreground text-sm"
      >
        {formatBlogDate(date)}
      </time>
      <Heading level={3} className="my-0 text-xl">
        {title}
      </Heading>
      <Muted className="leading-relaxed">{description}</Muted>
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
          <dt className="font-semibold text-sm">{author.name}</dt>
          {author.role && (
            <dd>
              <Small className="text-muted-foreground">{author.role}</Small>
            </dd>
          )}
        </dl>
      </div>
    </article>
  )
}
