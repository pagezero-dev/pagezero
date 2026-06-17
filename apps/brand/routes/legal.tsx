import { createFileRoute, notFound } from "@tanstack/react-router"
import { ProseArticle } from "@/brand/components/prose-article"
import { legalModules } from "@/brand/legal-modules"
import {
  getLegalDocumentFrontmatter,
  getLegalDocumentModuleBySlug,
} from "@/brand/utils"
import config from "@/config"
import { MDXProvider } from "@/mdx"
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
    const document = getLegalDocumentFrontmatter(legalModules, params.slug)
    if (!document) throw notFound()
    return { document }
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
  const mdxModule = getLegalDocumentModuleBySlug(legalModules, slug)
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
