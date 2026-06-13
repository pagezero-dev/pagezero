import { createFileRoute, notFound } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { PostHeader } from "@/blog/components/post-header"
import { postModules } from "@/blog/post-modules"
import { getPostModuleBySlug, getPostSummaryByPathname } from "@/blog/utils"
import config from "@/config"
import { MDXProvider } from "@/mdx"
import { Link } from "@/ui/link"

export const Route = createFileRoute("/_content-layout/blog/$slug")({
  loader: ({ params }) => {
    const slug = `/blog/${params.slug}`
    const post = getPostSummaryByPathname(postModules, slug)
    if (!post) throw notFound()
    return { post }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const { post } = loaderData
    const pageTitle = post.title
    return {
      meta: [
        { title: `${pageTitle} - ${config.core.projectName}` },
        { name: "description", content: post.description },
        ...(post.keywords?.length
          ? [{ name: "keywords", content: post.keywords.join(", ") }]
          : []),
        { property: "og:image", content: post.imgSrc },
      ],
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const { post } = Route.useLoaderData()
  const mdxModule = getPostModuleBySlug(postModules, post.slug)
  const PostComponent = mdxModule?.default

  if (!PostComponent) throw notFound()

  return (
    <div className="mx-auto max-w-prose px-5 py-32 text-muted-foreground">
      <nav className="mb-12">
        <Link
          href="/blog"
          size="sm"
          underline="hover"
          className="text-muted-foreground"
        >
          <ArrowLeft aria-hidden />
          All posts
        </Link>
      </nav>
      <PostHeader
        title={post.title}
        date={new Date(post.date)}
        imgSrc={post.imgSrc}
        author={post.author}
      />
      <MDXProvider>
        <PostComponent />
      </MDXProvider>
    </div>
  )
}
