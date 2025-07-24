import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/ui/utils"

const linkVariants = cva(
  "inline-flex cursor-pointer items-baseline gap-0.5 font-bold text-blue-600 underline-offset-4 visited:text-blue-900 hover:underline [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

const Link = ({
  size = "default",
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp className={cn(linkVariants({ size, className }))} {...props}>
      {children}
    </Comp>
  )
}

export { Link, linkVariants }
