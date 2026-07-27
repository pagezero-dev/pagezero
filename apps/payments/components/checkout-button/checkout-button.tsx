import type { ReactNode } from "react"

import { authClient } from "@/auth/auth-client"
import { Button, type ButtonProps } from "@/ui/button"

import type { Product } from "../../types"

type CheckoutButtonProps = {
  productId: Product
  children: ReactNode
} & Omit<ButtonProps, "asChild">

export const CheckoutButton = ({ productId, children, ...props }: CheckoutButtonProps) => {
  return (
    <Button
      type="button"
      {...props}
      onClick={() => {
        void authClient.checkout({ slug: productId })
      }}
    >
      {children}
    </Button>
  )
}
