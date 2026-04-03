import config from "@/config"
import { sendEmail } from "./email.server"
import AccessFailureEmail from "./templates/access.failure"
import AccessGrantedEmail from "./templates/access.granted"
import AccessRevokedEmail from "./templates/access.revoked"
import AuthOtpEmail from "./templates/auth-otp"

export function sendAuthOtpEmail({
  to,
  otp,
  env,
}: {
  to: string
  otp: string
  env: Env
}) {
  return sendEmail({
    from: config.email.from,
    to,
    subject: "Temporary Password",
    react: <AuthOtpEmail otp={otp} />,
    resendApiKey: env.RESEND_API_KEY,
  })
}

export function sendAccessFailureEmail({ to, env }: { to: string; env: Env }) {
  return sendEmail({
    from: config.email.from,
    to,
    subject: "Access failed",
    react: <AccessFailureEmail />,
    resendApiKey: env.RESEND_API_KEY,
  })
}

export function sendAccessRevokedEmail({
  to,
  env,
  productName,
}: {
  to: string
  env: Env
  productName: string
}) {
  return sendEmail({
    from: config.email.from,
    to,
    subject: "Access revoked",
    react: <AccessRevokedEmail productName={productName} />,
    resendApiKey: env.RESEND_API_KEY,
  })
}

export function sendAccessGrantedEmail({
  to,
  env,
  productName,
}: {
  to: string
  env: Env
  productName: string
}) {
  return sendEmail({
    from: config.email.from,
    to,
    subject: "Access granted",
    react: <AccessGrantedEmail productName={productName} />,
    resendApiKey: env.RESEND_API_KEY,
  })
}
