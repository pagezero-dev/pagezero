import { useState, type ReactNode } from "react"

import { auth } from "@/auth/auth"
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
          void auth.checkout({ slug: productId }).then(({ error: checkoutError }) => {
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
