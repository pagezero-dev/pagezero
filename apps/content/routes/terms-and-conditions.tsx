import config from "@/config"
import { Heading, List, Muted, P } from "@/ui/typography"
import { Section } from "../components/section"

export default function TermsAndConditions() {
  const projectName = config.core.projectName
  const supportEmail = config.core.supportEmail
  const websiteUrl = config.core.websiteUrl

  return (
    <Section title="Terms and Conditions">
      <div className="mx-auto max-w-prose text-muted-foreground">
        <Muted>Last updated: [Date]</Muted>

        <Heading level={3}>1. Agreement to Terms</Heading>
        <P>
          By accessing or using {projectName}, you agree to be bound by these
          Terms and Conditions and our{" "}
          <a
            href="/privacy"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Privacy Policy
          </a>
          . If you do not agree to these terms, please do not use our services.
        </P>

        <Heading level={3}>2. Description of Service</Heading>
        <P>
          {/* Update this section to describe your specific product or service */}
          {projectName} provides [describe your product or service here].
          Explain the core functionality and value proposition to your users.
        </P>
        <List>
          {/* Update with your actual service tiers or offerings */}
          <li>
            <strong>Free Plan</strong> — Describe what's included in your free
            tier
          </li>
          <li>
            <strong>Paid Plan</strong> — Describe what's included in your paid
            tier(s)
          </li>
        </List>

        <Heading level={3}>3. User Accounts</Heading>
        <P>
          To access certain features, you may be required to create an account.
          You are responsible for:
        </P>
        <List>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>
            Notifying us immediately of any unauthorized use of your account
          </li>
        </List>

        <Heading level={3}>4. Payments and Refunds</Heading>
        <P>
          {/* Update this section based on your pricing model */}
          If you purchase a paid plan, payment is processed through our payment
          provider. By completing a purchase, you agree to:
        </P>
        <List>
          <li>Pay the applicable fee as displayed at the time of purchase</li>
          <li>Provide accurate and complete billing information</li>
        </List>
        <P>
          {/* Update with your refund policy */}
          Refunds are handled on a case-by-case basis. If you are not satisfied
          with your purchase, please contact us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {supportEmail}
          </a>{" "}
          within [X] days of purchase to discuss your options.
        </P>

        <Heading level={3}>5. Third-Party Services</Heading>
        <P>
          {projectName} may integrate with third-party services. Your use of
          these services is subject to their respective terms of service and
          privacy policies. {projectName} is not responsible for the
          availability, functionality, or policies of third-party services.
        </P>
        <List>
          {/* Update with your actual third-party integrations */}
          <li>
            <strong>[Service Name]</strong> — [Description of how it's used]
          </li>
          <li>
            <strong>[Service Name]</strong> — [Description of how it's used]
          </li>
        </List>

        <Heading level={3}>6. Acceptable Use</Heading>
        <P>You agree not to use {projectName} to:</P>
        <List>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the intellectual property rights of others</li>
          <li>Distribute malware, viruses, or other harmful code</li>
          <li>
            Engage in any activity that disrupts or interferes with our services
          </li>
          <li>Harass, abuse, or harm other users</li>
        </List>

        <Heading level={3}>7. Intellectual Property</Heading>
        <P>
          The {projectName} brand, logo, and content are owned by us and are
          protected by intellectual property laws. You may not use our
          trademarks without prior written permission.
        </P>
        <P>
          {/* Update based on your business model */}
          Content you create using {projectName} belongs to you. You retain full
          ownership of your data and any content you produce through our
          service.
        </P>

        <Heading level={3}>8. Disclaimer of Warranties</Heading>
        <P>
          {projectName} is provided "as is" and "as available" without
          warranties of any kind, either express or implied. We do not warrant
          that:
        </P>
        <List>
          <li>The service will be error-free or uninterrupted</li>
          <li>The service will meet your specific requirements</li>
          <li>Any defects will be corrected</li>
        </List>

        <Heading level={3}>9. Limitation of Liability</Heading>
        <P>
          To the maximum extent permitted by law, {projectName} and its
          affiliates shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising out of or in connection
          with your use of the service, including but not limited to loss of
          profits, data, business opportunities, or revenue.
        </P>

        <Heading level={3}>10. Support</Heading>
        <P>
          We provide documentation and support resources to help you use{" "}
          {projectName}. While we strive to be helpful, we do not guarantee
          response times or resolution of specific issues. For support
          inquiries, contact us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {supportEmail}
          </a>
          .
        </P>

        <Heading level={3}>11. Termination</Heading>
        <P>
          We may suspend or terminate your access to {projectName} at any time
          for violation of these terms or for any other reason at our sole
          discretion. You may also terminate your account at any time by
          contacting us.
        </P>

        <Heading level={3}>12. Changes to Terms</Heading>
        <P>
          We reserve the right to modify these terms at any time. We will notify
          users of material changes by posting the updated terms on{" "}
          <a
            href={websiteUrl}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {websiteUrl}
          </a>
          . Your continued use of {projectName} after such changes constitutes
          acceptance of the new terms.
        </P>

        <Heading level={3}>13. Governing Law</Heading>
        <P>
          {/* Update with your jurisdiction */}
          These Terms and Conditions shall be governed by and construed in
          accordance with the laws of [Your Jurisdiction], without regard to its
          conflict of law provisions.
        </P>

        <Heading level={3}>14. Contact Us</Heading>
        <P>
          If you have any questions about these Terms and Conditions, please
          contact us at{" "}
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
