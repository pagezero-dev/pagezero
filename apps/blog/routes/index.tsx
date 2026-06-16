import { createFileRoute } from "@tanstack/react-router"
import { BlogPostsList } from "@/blog/components/blog-posts-list"
import { postModules } from "@/blog/post-modules"
import { getBlogPostFrontmatters } from "@/blog/utils"
import { Section } from "@/brand/components/section"

export const Route = createFileRoute("/_brand-layout/blog")({
  loader: () => ({ posts: getBlogPostFrontmatters(postModules) }),
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
