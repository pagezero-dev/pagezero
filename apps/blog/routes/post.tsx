import {
  createFileRoute,
  notFound,
  Link as RouterLink,
} from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { BlogPostSummary } from "@/blog/components/blog-post-summary"
import { postModules } from "@/blog/post-modules"
import { getBlogPostFrontmatter, getBlogPostModuleBySlug } from "@/blog/utils"
import config from "@/config"
import { MDXProvider } from "@/mdx"
import { Link } from "@/ui/link"

export const Route = createFileRoute("/_content-layout/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostFrontmatter(postModules, params.slug)
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
  const { slug } = Route.useParams()
  const mdxModule = getBlogPostModuleBySlug(postModules, slug)
  const PostComponent = mdxModule?.default

  if (!PostComponent) throw notFound()

  return (
    <div className="mx-auto max-w-prose px-5 py-32 text-muted-foreground">
      <nav className="mb-12">
        <Link
          size="sm"
          underline="hover"
          asChild
          className="text-muted-foreground"
        >
          <RouterLink to="/blog">
            <ArrowLeft aria-hidden />
            All posts
          </RouterLink>
        </Link>
      </nav>
      <BlogPostSummary
        variant="header"
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
