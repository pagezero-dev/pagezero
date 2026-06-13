import { createFileRoute } from "@tanstack/react-router"
import { PostList } from "@/blog/components/post-list"
import { postModules } from "@/blog/post-modules"
import { buildPostSummaries } from "@/blog/utils"
import { Section } from "@/content/components/section"

export const Route = createFileRoute("/_content-layout/blog")({
  loader: () => ({ posts: buildPostSummaries(postModules) }),
  component: BlogIndex,
})

function BlogIndex() {
  const { posts } = Route.useLoaderData()

  return (
    <Section id="blog" title="Blog">
      <div className="mx-auto max-w-6xl">
        <PostList posts={posts} />
      </div>
    </Section>
  )
}
