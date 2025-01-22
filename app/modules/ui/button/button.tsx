import { clsx } from "clsx"
import { Slot } from "@radix-ui/react-slot"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "link"
  | "danger"
  | "outline"

type ButtonSize = "default" | "small" | "large"

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

export const Button = ({
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      type="button"
      className={clsx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-blue-600 text-white hover:bg-blue-600/90": variant === "primary",
          "bg-gray-200 hover:bg-gray-200/80": variant === "secondary",
          "bg-red-600 text-white hover:bg-red-600/90": variant === "danger",
          "border border-gray-300 bg-white hover:bg-gray-100":
            variant === "outline",
          "hover:bg-gray-100": variant === "ghost",
          "px-4 py-2": size === "default",
          "px-8 py-3": size === "large",
          "px-3 py-1": size === "small",
        },
      )}
      {...props}
    />
  )
}
