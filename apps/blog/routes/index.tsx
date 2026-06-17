import { createFileRoute } from "@tanstack/react-router"
import { BlogPostsList } from "@/blog/components/blog-posts-list"
import { blogPostFrontmatterSchema, postModules } from "@/blog/content"
import { Section } from "@/brand/components/section"
import { getMdxFrontmatters } from "@/mdx"

export const Route = createFileRoute("/_brand-layout/blog")({
  loader: () => ({
    posts: getMdxFrontmatters(postModules, blogPostFrontmatterSchema).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  }),
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
