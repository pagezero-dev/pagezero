import { Mail } from "lucide-react"
import { Button, Heading, Text } from "react-email"
import Layout from "./layout"

interface NewsletterConfirmEmailProps {
  confirmUrl: string
}

export default function NewsletterConfirmEmail({
  confirmUrl,
}: NewsletterConfirmEmailProps) {
  return (
    <Layout>
      <Mail className="size-16 text-gray-800" />
      <Heading as="h1">Confirm your subscription</Heading>
      <Text>
        You&apos;re receiving this email because someone requested to subscribe
        this address to our newsletter.
      </Text>
      <Text>Click the button below to confirm. This link expires soon.</Text>
      <Button
        href={confirmUrl}
        className="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-800 text-sm shadow-xs"
      >
        Confirm subscription
      </Button>
    </Layout>
  )
}
