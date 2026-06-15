import { Link } from "@tanstack/react-router"
import { BlogPostSummary } from "@/blog/components/blog-post-summary"
import type { BlogPostSummary as BlogPostSummaryData } from "@/blog/types"

interface BlogPostsListProps {
  posts: BlogPostSummaryData[]
}

export function BlogPostsList({ posts }: BlogPostsListProps) {
  return (
    <ul className="grid list-none grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block rounded-xl no-underline outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <BlogPostSummary
              variant="summary"
              title={post.title}
              description={post.description}
              date={new Date(post.date)}
              imgSrc={post.imgSrc}
              author={post.author}
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
