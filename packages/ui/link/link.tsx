import * as React from "react"
import { Slot as SlotPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/ui/utils"

const linkVariants = cva(
  "text-primary focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-0.5 font-medium whitespace-nowrap underline underline-offset-4 transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
  const Comp = asChild ? SlotPrimitive.Slot : "a"

  return (
    <Comp className={cn(linkVariants({ size, className }))} {...props}>
      {children}
    </Comp>
  )
}

export { Link, linkVariants }
