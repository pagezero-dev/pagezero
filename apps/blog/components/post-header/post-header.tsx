import { User } from "lucide-react"
import { PostCover } from "@/blog/components/post-cover"
import type { BlogPostAuthor } from "@/blog/types"
import { Link } from "@/ui/link"
import { Heading, Small } from "@/ui/typography"

/** Stable across SSR and client; date-only frontmatter parses as UTC midnight */
function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

interface PostHeaderProps {
  title: string
  date: Date
  imgSrc: string
  author: BlogPostAuthor
}

export const PostHeader = ({
  title,
  date,
  imgSrc,
  author,
}: PostHeaderProps) => {
  return (
    <header className="mb-12">
      <PostCover src={imgSrc} alt={title} className="mb-8" />
      <time
        dateTime={date.toISOString()}
        className="mb-4 block text-muted-foreground text-sm"
      >
        {formatBlogDate(date)}
      </time>
      <Heading level={1} className="mt-0 mb-6 text-foreground">
        {title}
      </Heading>
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
          <dt className="font-semibold text-foreground text-sm">
            {author.url ? (
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
    </header>
  )
}
