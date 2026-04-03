import { render } from "@react-email/render"
import { Resend } from "resend"

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
  from: string
  to: string | string[]
  subject: string
  react: React.ReactNode
  resendApiKey?: string
}

export async function sendEmail({
  from,
  to,
  subject,
  react,
  resendApiKey,
}: SendOptions) {
  if (!resendApiKey) {
    if (import.meta.env.PROD) {
      throw new Error("resendApiKey is not given")
    }
    const body = await render(react, { plainText: true })
    const content = `From: ${from}\nTo: ${Array.isArray(to) ? to.join(", ") : to}\nSubject: ${subject}\nBody:\n${body}`
    console.log("An attempt to send an email")
    console.log(content)
    developmentMailsSent.push({ from, to, subject, body })
    return
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

  return data
}
