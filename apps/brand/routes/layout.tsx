import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import { useLogout, useUser } from "@/auth/hooks"
import { Footer } from "@/brand/components/footer"
import { Header } from "@/brand/components/header"
import { Logo } from "@/brand/components/logo"
import config from "@/config"
import { Button } from "@/ui/button"
import { Dropdown } from "@/ui-lite/dropdown"

export const Route = createFileRoute("/_brand-layout")({
  component: ContentLayout,
})

function ContentLayout() {
  const logout = useLogout()
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
          <Link to="/blog">Blog</Link>
        </Button>
        <Button variant="ghost" asChild>
          <a href="/docs">Docs</a>
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
                  <button type="button" onClick={() => void logout()}>
                    Logout
                  </button>
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
              { label: "Privacy", href: "/legal/privacy" },
              {
                label: "Terms and Conditions",
                href: "/legal/terms-and-conditions",
              },
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
