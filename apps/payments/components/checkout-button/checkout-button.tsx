import type { ReactNode } from "react"
import config from "@/config"
import { Button, type ButtonProps } from "@/ui/button"
import { useUser } from "@/user/use-user"
import type { Product } from "../../types"

type CheckoutButtonProps = {
  productId: Product
  children: ReactNode
} & Omit<ButtonProps, "asChild">

export const CheckoutButton = ({
  productId,
  children,
  ...props
}: CheckoutButtonProps) => {
  const { data: userData } = useUser()
  const user = userData?.user
  const mode = import.meta.env.PROD ? "production" : "preview"
  const href = new URL(config.payments.products[productId].checkoutLink[mode])
  if (user?.email) {
    href.searchParams.set("customer_email", user.email)
  }
  return (
    <Button asChild {...props}>
      <a href={href.toString()}>{children}</a>
    </Button>
  )
}
