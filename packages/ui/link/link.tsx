import { cva, type VariantProps } from "class-variance-authority"
import { Slot as SlotPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/ui/utils"

const linkVariants = cva(
  "inline-flex items-center gap-0.5 whitespace-nowrap font-medium text-primary underline-offset-4 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
      },
      underline: {
        always: "underline",
        none: "no-underline",
        hover: "hover:underline",
      },
    },
    defaultVariants: {
      size: "default",
      underline: "always",
    },
  },
)

const Link = ({
  size = "default",
  underline = "always",
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? SlotPrimitive.Slot : "a"

  return (
    <Comp
      className={cn(linkVariants({ size, underline, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Link, linkVariants }
