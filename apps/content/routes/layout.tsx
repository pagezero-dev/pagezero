import { ChevronDown } from "lucide-react"
import { Link, Outlet } from "react-router"
import config from "@/config"
import { Footer } from "@/content/components/footer"
import { Header } from "@/content/components/header"
import { Logo } from "@/content/components/logo"
import { Button } from "@/ui/button"
import { Dropdown } from "@/ui-lite/dropdown"
import { useUser } from "@/user/use-user"

export default function ContentLayout() {
  const { data: userData } = useUser()
  const user = userData?.user
  return (
    <>
      <Header
        position="absolute"
        logo={
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="size-9" />
            {config.core.projectName}
          </a>
        }
      >
        <Button variant="ghost" asChild>
          <a href="/#pricing">Pricing</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="/#about">About</a>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/docs">Docs</Link>
        </Button>
        {user ? (
          <Dropdown
            menu={
              <Dropdown.Menu align="end">
                <Dropdown.MenuItem>
                  <button type="button">Settings</button>
                </Dropdown.MenuItem>
                <Dropdown.MenuItem>
                  <button type="button">Profile</button>
                </Dropdown.MenuItem>
                <Dropdown.MenuItem>
                  <form action="/logout" method="post">
                    <button type="submit">Logout</button>
                  </form>
                </Dropdown.MenuItem>
              </Dropdown.Menu>
            }
          >
            <Button variant="outline">
              {user.email} <ChevronDown className="h-5 w-5" />
            </Button>
          </Dropdown>
        ) : (
          <Button variant="default" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        )}
      </Header>

      <main>
        <Outlet />
      </main>

      <Footer
        companyName={config.core.projectName}
        navigation={[
          {
            heading: "Product",
            children: [
              { label: "Pricing", href: "/#pricing" },
              {
                label: "Documentation",
                href: "/docs",
              },
              {
                label: "Getting Started",
                href: "/getting-started",
              },
            ],
          },
          {
            heading: "About",
            children: [
              { label: "Author", href: "/#about" },
              { label: "FAQ", href: "/#faq" },
            ],
          },
          {
            heading: "Support",
            children: [
              {
                label: "GitHub Issues",
                href: "https://github.com/yourusername/yourproject/issues",
              },
              {
                label: "E-mail",
                href: `mailto:${config.core.supportEmail}`,
              },
            ],
          },
          {
            heading: "Legal",
            children: [
              { label: "Privacy", href: "/privacy" },
              { label: "Terms and Conditions", href: "/terms-and-conditions" },
            ],
          },
        ]}
        socialMediaUrls={{
          twitterUrl: "https://x.com/yourusername/",
          githubUrl: "https://github.com/yourusername/yourproject",
          youtubeUrl: "https://youtube.com/@yourchannel",
        }}
      />
    </>
  )
}
