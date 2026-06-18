import { env } from "cloudflare:workers"
import { render } from "react-email"
import { Resend } from "resend"
import config from "@/config"

export type EmailConfig = {
  email: {
    from: string
  }
}
export interface DevelopmentEmailPayload {
  from: string
  to: string | string[]
  subject: string
  body: string
}
export const developmentMailsSent: DevelopmentEmailPayload[] = []

interface SendOptions {
  from?: string
  to: string | string[]
  subject: string
  react: React.ReactNode
}

interface SendEmailResponse {
  id: string
}

export async function sendEmail({
  from = config.email.from,
  to,
  subject,
  react,
}: SendOptions): Promise<SendEmailResponse> {
  const resendApiKey = env.RESEND_API_KEY

  if (!resendApiKey) {
    if (import.meta.env.PROD) {
      throw new Error("RESEND_API_KEY is not set")
    }
    const body = await render(react, { plainText: true })
    const content = `From: ${from}\nTo: ${Array.isArray(to) ? to.join(", ") : to}\nSubject: ${subject}\nBody:\n${body}`
    console.log("An attempt to send an email")
    console.log(content)
    developmentMailsSent.push({ from, to, subject, body })
    return { id: "development" }
  }
  const resend = new Resend(resendApiKey)
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error("Failed to send email")
  }

  return data
}
