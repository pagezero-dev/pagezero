import {
  createFileRoute,
  notFound,
  Link as RouterLink,
} from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { BlogPostSummary } from "@/blog/components/blog-post-summary"
import { postModules } from "@/blog/post-modules"
import { blogPostFrontmatterSchema } from "@/blog/types"
import { ProseArticle } from "@/brand/components/prose-article"
import config from "@/config"
import { getMdxModuleBySlug, MDXProvider } from "@/mdx"
import { Link } from "@/ui/link"

export const Route = createFileRoute("/_brand-layout/blog/$slug")({
  loader: ({ params }) => {
    const mdxModule = getMdxModuleBySlug(
      postModules,
      blogPostFrontmatterSchema,
      params.slug,
    )
    if (!mdxModule) throw notFound()
    return { post: mdxModule.frontmatter }
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
  const mdxModule = getMdxModuleBySlug(
    postModules,
    blogPostFrontmatterSchema,
    slug,
  )
  const PostComponent = mdxModule?.default

  if (!PostComponent) throw notFound()

  return (
    <ProseArticle>
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
    </ProseArticle>
  )
}
