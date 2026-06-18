import { sendEmail } from "./email.server"
import AccessFailureEmail from "./templates/access.failure"
import AccessGrantedEmail from "./templates/access.granted"
import AccessRevokedEmail from "./templates/access.revoked"
import AuthOtpEmail from "./templates/auth-otp"
import NewsletterConfirmEmail from "./templates/newsletter-confirm"

export function sendAuthOtpEmail({ to, otp }: { to: string; otp: string }) {
  return sendEmail({
    to,
    subject: "Temporary Password",
    react: <AuthOtpEmail otp={otp} />,
  })
}

export function sendNewsletterConfirmEmail({
  to,
  confirmUrl,
}: {
  to: string
  confirmUrl: string
}) {
  return sendEmail({
    to,
    subject: "Confirm your newsletter subscription",
    react: <NewsletterConfirmEmail confirmUrl={confirmUrl} />,
  })
}

export function sendAccessFailureEmail({ to }: { to: string }) {
  return sendEmail({
    to,
    subject: "Access failed",
    react: <AccessFailureEmail />,
  })
}

export function sendAccessRevokedEmail({
  to,
  productName,
}: {
  to: string
  productName: string
}) {
  return sendEmail({
    to,
    subject: "Access revoked",
    react: <AccessRevokedEmail productName={productName} />,
  })
}

export function sendAccessGrantedEmail({
  to,
  productName,
}: {
  to: string
  productName: string
}) {
  return sendEmail({
    to,
    subject: "Access granted",
    react: <AccessGrantedEmail productName={productName} />,
  })
}
