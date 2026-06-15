import { createFileRoute } from "@tanstack/react-router"
import { BlogPostsList } from "@/blog/components/blog-posts-list"
import { postModules } from "@/blog/post-modules"
import { getBlogPostSummaries } from "@/blog/utils"
import { Section } from "@/content/components/section"

export const Route = createFileRoute("/_content-layout/blog")({
  loader: () => ({ posts: getBlogPostSummaries(postModules) }),
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
