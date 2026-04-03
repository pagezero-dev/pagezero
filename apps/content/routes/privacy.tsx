import config from "@/config"
import { Heading, List, Muted, P } from "@/ui/typography"
import { Section } from "../components/section"

export default function Privacy() {
  const projectName = config.core.projectName
  const supportEmail = config.core.supportEmail
  const websiteUrl = config.core.websiteUrl

  return (
    <Section title="Privacy Policy">
      <div className="mx-auto max-w-prose text-muted-foreground">
        <Muted>Last updated: [Date]</Muted>

        <Heading level={3}>1. Introduction</Heading>
        <P>
          This Privacy Policy explains how {projectName} ("we", "us", or "our")
          collects, uses, and protects your personal information when you use
          our website at{" "}
          <a
            href={websiteUrl}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {websiteUrl}
          </a>{" "}
          and our services.
        </P>

        <Heading level={3}>2. Information We Collect</Heading>
        <P>We collect information in the following ways:</P>

        <P>
          <strong>Information you provide directly:</strong>
        </P>
        <List>
          <li>
            <strong>Account information</strong> — Email address when you create
            an account or sign in
          </li>
          <li>
            <strong>Payment information</strong> — Billing details when you make
            a purchase (processed securely by our payment provider)
          </li>
          <li>
            <strong>Communications</strong> — Information you provide when
            contacting us for support
          </li>
        </List>

        <P>
          <strong>Information collected automatically:</strong>
        </P>
        <List>
          <li>
            <strong>Usage data</strong> — Pages visited, features used, and
            interactions with the website
          </li>
          <li>
            <strong>Device information</strong> — Browser type, operating
            system, and device identifiers
          </li>
          <li>
            <strong>Log data</strong> — IP address, access times, and referring
            URLs
          </li>
        </List>

        <Heading level={3}>3. How We Use Your Information</Heading>
        <P>We use the information we collect to:</P>
        <List>
          <li>Provide and maintain our services</li>
          <li>Process your purchases and manage your account</li>
          <li>
            Send transactional emails (authentication codes, purchase
            confirmations, account notifications)
          </li>
          <li>Respond to your support requests</li>
          <li>Improve our website and services</li>
          <li>Detect and prevent fraud or abuse</li>
          <li>Comply with legal obligations</li>
        </List>

        <Heading level={3}>4. Third-Party Services</Heading>
        <P>
          We use third-party services to operate {projectName}. These services
          may collect and process your data according to their own privacy
          policies:
        </P>
        <List>
          {/* Update this list with your actual third-party service providers */}
          <li>
            <strong>[Hosting Provider]</strong> — Website hosting and
            infrastructure
          </li>
          <li>
            <strong>[Payment Provider]</strong> — Payment processing and billing
          </li>
          <li>
            <strong>[Email Provider]</strong> — Transactional email delivery
          </li>
          <li>
            <strong>[Analytics Provider]</strong> — Website analytics (if
            applicable)
          </li>
        </List>

        <Heading level={3}>5. Cookies and Tracking</Heading>
        <P>We use cookies and similar technologies for:</P>
        <List>
          <li>
            <strong>Essential cookies</strong> — Required for authentication and
            session management
          </li>
          <li>
            <strong>Analytics</strong> — To understand how visitors use our
            website
          </li>
        </List>
        <P>
          {/* Update this based on your analytics provider */}
          You can manage cookie preferences through your browser settings.
        </P>

        <Heading level={3}>6. Data Retention</Heading>
        <P>We retain your personal information for as long as necessary to:</P>
        <List>
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce our agreements</li>
        </List>
        <P>
          When you delete your account, we will delete or anonymize your
          personal information within 30 days, except where we are required to
          retain it for legal purposes.
        </P>

        <Heading level={3}>7. Data Security</Heading>
        <P>
          We implement appropriate technical and organizational measures to
          protect your personal information, including:
        </P>
        <List>
          <li>Encryption of data in transit (HTTPS/TLS)</li>
          <li>Secure session management</li>
          <li>Regular security reviews</li>
        </List>
        <P>
          However, no method of transmission over the internet is 100% secure.
          We cannot guarantee absolute security of your data.
        </P>

        <Heading level={3}>8. Your Rights</Heading>
        <P>
          Depending on your location, you may have the following rights
          regarding your personal information:
        </P>
        <List>
          <li>
            <strong>Access</strong> — Request a copy of the personal information
            we hold about you
          </li>
          <li>
            <strong>Correction</strong> — Request correction of inaccurate or
            incomplete information
          </li>
          <li>
            <strong>Deletion</strong> — Request deletion of your personal
            information
          </li>
          <li>
            <strong>Portability</strong> — Request a copy of your data in a
            portable format
          </li>
          <li>
            <strong>Objection</strong> — Object to processing of your personal
            information
          </li>
        </List>
        <P>
          To exercise these rights, contact us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {supportEmail}
          </a>
          .
        </P>

        <Heading level={3}>9. International Data Transfers</Heading>
        <P>
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place for
          such transfers in accordance with applicable data protection laws.
        </P>

        <Heading level={3}>10. Children's Privacy</Heading>
        <P>
          {projectName} is not intended for children under 16 years of age. We
          do not knowingly collect personal information from children. If you
          believe we have collected information from a child, please contact us
          immediately.
        </P>

        <Heading level={3}>11. Changes to This Policy</Heading>
        <P>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the updated policy on{" "}
          <a
            href={websiteUrl}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {websiteUrl}
          </a>{" "}
          and updating the "Last updated" date. Your continued use of{" "}
          {projectName} after such changes constitutes acceptance of the updated
          policy.
        </P>

        <Heading level={3}>12. Contact Us</Heading>
        <P>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {supportEmail}
          </a>
          .
        </P>
      </div>
    </Section>
  )
}
