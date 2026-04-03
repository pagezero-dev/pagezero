import { Heading, Text } from "@react-email/components"
import { RectangleEllipsis } from "lucide-react"
import Layout from "./layout"

interface AuthOtpEmailProps {
  otp: string
}

export default function AuthOtpEmail({ otp }: AuthOtpEmailProps) {
  return (
    <Layout>
      <RectangleEllipsis className="size-16 text-gray-800" />
      <Heading as="h1">Verify your email address</Heading>
      <Text>
        You're receiving this email because you've requested a verification
        code.
      </Text>
      <Text className="text-lg">Verification code:</Text>
      <Text className="m-5 rounded-2xl bg-white p-5 text-4xl">{otp}</Text>
    </Layout>
  )
}
