import { Link } from "@/ui/link"
import { Heading, Muted } from "@/ui/typography"
import { Social, type SocialMediaUrls } from "../social"

interface Navigation {
  heading: string
  children: { label: string; href: string }[]
}

interface FooterProps {
  companyName: string
  navigation: Navigation[]
  socialMediaUrls?: SocialMediaUrls
}

export const Footer = ({
  companyName,
  navigation,
  socialMediaUrls,
}: FooterProps) => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="container mx-auto mt-40 px-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {navigation.map(({ heading, children }) => (
          <section key={heading} className="space-y-3">
            <Heading level={3} className="text-base">
              {heading}
            </Heading>
            <ul className="space-y-2">
              {children.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    size="sm"
                    underline="hover"
                    className="text-muted-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-24 flex flex-col items-center justify-between gap-8 border-border border-t py-8 sm:flex-row">
        <Muted>
          © {currentYear} {companyName}. All rights reserved.
        </Muted>
        {socialMediaUrls && <Social {...socialMediaUrls} />}
      </div>
    </footer>
  )
}
