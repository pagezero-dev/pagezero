import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ReactNode,
  createContext,
  useContext,
  type AnchorHTMLAttributes,
} from "react"

import { cn } from "@/ui/utils"

const linkVariants = cva(
  "inline-flex cursor-pointer items-baseline gap-0.5 font-bold text-blue-600 underline-offset-4 visited:text-blue-900 hover:underline",
  {
    variants: {
      size: {
        default: "",
        small: "text-sm",
        large: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

type LinkSize = "default" | "small" | "large"

const LinkContext = createContext({ size: "default" as LinkSize })

interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean
}

export const Link = ({
  size = "default",
  asChild,
  children,
  className,
  ...props
}: LinkProps) => {
  const Comp = asChild ? Slot : "a"
  return (
    <LinkContext.Provider value={{ size: size || "default" }}>
      <Comp className={cn(linkVariants({ size, className }))} {...props}>
        {children}
      </Comp>
    </LinkContext.Provider>
  )
}

interface LinkIconProps {
  children: ReactNode
}

const LinkIcon = ({ children }: LinkIconProps) => {
  const { size } = useContext(LinkContext)
  return (
    <div
      className={cn("inline-block self-center", {
        "h-5 w-5": size === "default",
        "h-4 w-4": size === "small",
        "h-6 w-6": size === "large",
      })}
    >
      {children}
    </div>
  )
}

LinkIcon.displayName = "Link.Icon"
Link.Icon = LinkIcon

export { linkVariants }
