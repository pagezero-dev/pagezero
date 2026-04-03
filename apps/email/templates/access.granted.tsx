import { Button, Heading, Section, Text } from "@react-email/components"
import { CircleCheck } from "lucide-react"
import config from "@/config"
import Layout from "./layout"

interface AccessGrantedEmailProps {
  productName: string
}

export default function AccessGrantedEmail({
  productName,
}: AccessGrantedEmailProps) {
  return (
    <Layout>
      <CircleCheck className="size-16 fill-green-500 text-white" />
      <Heading as="h1">Access granted</Heading>
      <Text>You've been granted access to "{productName}"</Text>
      <Text>Thank you for your purchase!</Text>
      <Section className="mb-4 max-w-sm">
        <Heading as="h2">What's next?</Heading>

        <Text>
          Your purchase is connected to the email address you provided during
          checkout.
        </Text>
        <Text>Sign in with the same email address to access your content.</Text>
        <Button
          href={`${config.core.websiteUrl}/login`}
          className="rounded-md bg-black px-4 py-2 font-medium text-sm text-white shadow-xs"
        >
          Sign in
        </Button>
      </Section>
    </Layout>
  )
}
