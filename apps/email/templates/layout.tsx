import {
  Container,
  Font,
  Head,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components"
import type { ReactNode } from "react"
import config from "@/config"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Tailwind>
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Container className="rounded-lg bg-gray-100 p-6 text-center">
          {children}
        </Container>
        <Container className="mt-8 text-center text-gray-500 text-sm">
          <Text className="mb-0">
            © {new Date().getFullYear()} {config.core.projectName}
          </Text>
          <Link href={config.core.websiteUrl}>
            {new URL(config.core.websiteUrl).hostname}
          </Link>
        </Container>
      </Html>
    </Tailwind>
  )
}
