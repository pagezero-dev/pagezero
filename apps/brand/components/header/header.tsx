import { clsx } from "clsx"
import { Menu, X } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Button } from "@/ui/button"

interface HeaderProps {
  logo: ReactNode
  children: ReactNode
  position?: "relative" | "sticky" | "absolute"
}

export const Header = ({
  logo,
  children,
  position = "relative",
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <header
      className={clsx("z-10 px-5 py-4", {
        relative: position === "relative",
        "absolute inset-x-0 top-0": position === "absolute",
        "sticky top-0 bg-background/60 backdrop-blur-md": position === "sticky",
        "lg:bg-transparent": position !== "sticky",
        "bg-background": isMobileMenuOpen && position !== "sticky",
      })}
    >
      <nav className="flex items-center justify-between">
        <div>{logo}</div>

        <div className="lg:hidden">
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div
          className={clsx(
            [
              // Mobile
              "absolute inset-x-0 bottom-0 translate-y-full flex-col gap-6 border-border border-y bg-background p-5 pb-8",
              // Desktop
              "lg:static lg:inset-x-auto lg:bottom-auto lg:flex lg:translate-y-0 lg:flex-row lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0",
            ],
            {
              hidden: !isMobileMenuOpen,
              flex: isMobileMenuOpen,
            },
          )}
        >
          {children}
        </div>
      </nav>
    </header>
  )
}
