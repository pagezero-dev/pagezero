import { PostSummary } from "@/blog/components/post-summary"
import type { BlogPostSummary } from "@/blog/utils"
import { Link } from "@/ui/link"

interface PostListProps {
  posts: BlogPostSummary[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="grid list-none grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={post.slug}
            underline="none"
            className="block rounded-xl outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <PostSummary
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
