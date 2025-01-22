import { clsx } from "clsx"
import { Slot } from "@radix-ui/react-slot"
import { ReactNode, createContext, useContext } from "react"

type LinkSize = "default" | "small" | "large"

const LinkContext = createContext({ size: "default" })

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  size?: LinkSize
  asChild?: boolean
}

export const Link = ({
  size = "default",
  asChild,
  children,
  ...props
}: LinkProps) => {
  const Comp = asChild ? Slot : "a"
  return (
    <LinkContext.Provider value={{ size }}>
      <Comp
        className={clsx(
          "inline-flex cursor-pointer items-baseline gap-0.5 font-bold text-blue-600 underline-offset-4 visited:text-blue-900 hover:underline",
          {
            "text-sm": size === "small",
            "text-lg": size === "large",
          },
        )}
        {...props}
      >
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
      className={clsx("inline-block self-center", {
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
