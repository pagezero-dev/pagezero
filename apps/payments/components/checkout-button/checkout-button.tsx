import { useState, type ReactNode } from "react"

import { Dialog } from "@/ui-lite/dialog"
import { Button, type ButtonProps } from "@/ui/button"

import type { Product } from "../../types"

type CheckoutButtonProps = {
  productId: Product
  children: ReactNode
} & Omit<ButtonProps, "asChild">

export const CheckoutButton = ({ productId, children, ...props }: CheckoutButtonProps) => {
  const [error, setError] = useState<string>()

  return (
    <Dialog
      open={error != null}
      onOpenChange={(open) => {
        if (!open) {
          setError(undefined)
        }
      }}
      content={
        <Dialog.Content
          title="Checkout unavailable"
          description={error}
          onOk={() => setError(undefined)}
        />
      }
    >
      <Button
        type="button"
        {...props}
        onClick={() => {
          void import("@/auth/auth.client").then(async ({ authClient }) => {
            const { error: checkoutError } = await authClient.checkout({ slug: productId })
            if (checkoutError) {
              setError(checkoutError.message ?? "Checkout failed")
            }
          })
        }}
      >
        {children}
      </Button>
    </Dialog>
  )
}
