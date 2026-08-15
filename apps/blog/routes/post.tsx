import { createFileRoute, notFound, Link as RouterLink } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { BlogPostSummary } from "@/blog/components/blog-post-summary"
import { blogPostFrontmatterSchema, postModules } from "@/blog/content"
import { ProseArticle } from "@/brand/components/prose-article"
import config from "@/config"
import { getMdxModuleBySlug, MDXProvider } from "@/mdx"
import { Link } from "@/ui/link"

export const Route = createFileRoute("/_brand-layout/blog/$slug")({
  loader: ({ params }) => {
    const mdxModule = getMdxModuleBySlug(postModules, blogPostFrontmatterSchema, params.slug)
    if (!mdxModule) throw notFound()
    return { post: mdxModule.frontmatter }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const { post } = loaderData
    const title = `${post.title} - ${config.core.projectName}`
    const imageUrl = new URL(post.imgSrc, config.core.websiteUrl).href
    return {
      meta: [
        { title },
        { name: "description", content: post.description },
        ...(post.keywords?.length ? [{ name: "keywords", content: post.keywords.join(", ") }] : []),
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: post.description },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: imageUrl },
      ],
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const { post } = Route.useLoaderData()
  const { slug } = Route.useParams()
  const mdxModule = getMdxModuleBySlug(postModules, blogPostFrontmatterSchema, slug)
  const PostComponent = mdxModule?.default

  if (!PostComponent) throw notFound()

  return (
    <ProseArticle>
      <nav className="mb-12">
        <Link size="sm" underline="hover" asChild className="text-muted-foreground">
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
