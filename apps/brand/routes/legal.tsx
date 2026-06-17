import { createFileRoute, notFound } from "@tanstack/react-router"
import { ProseArticle } from "@/brand/components/prose-article"
import { legalModules } from "@/brand/legal-modules"
import { legalDocumentFrontmatterSchema } from "@/brand/types"
import config from "@/config"
import { getMdxModuleBySlug, MDXProvider } from "@/mdx"
import { Muted } from "@/ui/typography"

function formatLegalDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export const Route = createFileRoute("/_brand-layout/legal/$slug")({
  loader: ({ params }) => {
    const mdxModule = getMdxModuleBySlug(
      legalModules,
      legalDocumentFrontmatterSchema,
      params.slug,
    )
    if (!mdxModule) throw notFound()
    return { document: mdxModule.frontmatter }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const { document } = loaderData
    return {
      meta: [{ title: `${document.title} - ${config.core.projectName}` }],
    }
  },
  component: LegalDocument,
})

function LegalDocument() {
  const { document } = Route.useLoaderData()
  const { slug } = Route.useParams()
  const mdxModule = getMdxModuleBySlug(
    legalModules,
    legalDocumentFrontmatterSchema,
    slug,
  )
  const DocumentComponent = mdxModule?.default

  if (!DocumentComponent) throw notFound()

  return (
    <ProseArticle title={document.title}>
      <Muted>Last updated: {formatLegalDate(new Date(document.date))}</Muted>
      <MDXProvider>
        <DocumentComponent />
      </MDXProvider>
    </ProseArticle>
  )
}
