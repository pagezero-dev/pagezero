import { createFileRoute } from "@tanstack/react-router"
import { BlogPostsList } from "@/blog/components/blog-posts-list"
import { getBlogPostSummaries } from "@/blog/rpc"
import { Section } from "@/content/components/section"

export const Route = createFileRoute("/_content-layout/blog")({
  loader: async () => ({ posts: await getBlogPostSummaries() }),
  component: BlogIndex,
})

function BlogIndex() {
  const { posts } = Route.useLoaderData()

  return (
    <Section id="blog" title="Blog">
      <div className="mx-auto max-w-6xl">
        <BlogPostsList posts={posts} />
      </div>
    </Section>
  )
}
