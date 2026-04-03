import { Heading, Link, Text } from "@react-email/components"
import { CircleAlert } from "lucide-react"
import config from "@/config"
import Layout from "./layout"

export default function AccessFailureEmail() {
  return (
    <Layout>
      <CircleAlert className="size-16 fill-red-500 text-white" />
      <Heading as="h1">Access failed</Heading>
      <Text>We're sorry, but we couldn't grant you access.</Text>
      <Text>Please contact our support team if you need help:</Text>
      <Text>
        <Link href={`mailto:${config.core.supportEmail}`}>
          {config.core.supportEmail}
        </Link>
      </Text>
    </Layout>
  )
}
