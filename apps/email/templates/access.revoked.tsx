import { Heading, Link, Text } from "@react-email/components"
import { Ban } from "lucide-react"
import config from "@/config"
import Layout from "./layout"

interface AccessRevokedEmailProps {
  productName: string
}

export default function AccessRevokedEmail({
  productName,
}: AccessRevokedEmailProps) {
  return (
    <Layout>
      <Ban className="size-16 text-red-500" />
      <Heading as="h1">Access revoked</Heading>
      <Text>Your access to "{productName}" has been revoked.</Text>
      <Text>
        If you have any questions, please contact our support team at:
      </Text>
      <Text>
        <Link href={`mailto:${config.core.supportEmail}`}>
          {config.core.supportEmail}
        </Link>
      </Text>
    </Layout>
  )
}
