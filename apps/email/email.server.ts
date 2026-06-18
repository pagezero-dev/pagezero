import { env } from "cloudflare:workers"
import { render } from "react-email"
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
  const html = await render(react)

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send email (${response.status})`)
  }

  return response.json()
}
