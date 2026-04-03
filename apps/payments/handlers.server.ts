import type { RouterContextProvider } from "react-router"
import config from "@/config"
import { envContext } from "@/core/context"
import { dbContext } from "@/db/context"
import {
  sendAccessFailureEmail,
  sendAccessGrantedEmail,
  sendAccessRevokedEmail,
} from "@/email/templates.server"
import { grantUserRole, hasUserRole, revokeUserRole } from "@/permissions"
import { getOrCreateUserByEmail, getUserByEmail } from "@/user"
import type {
  WebhookOrderPaidPayload,
  WebhookOrderRefundedPayload,
  WebhookSubscriptionActivePayload,
  WebhookSubscriptionRevokedPayload,
} from "./types"

export async function onPaymentSuccess(
  event: WebhookOrderPaidPayload | WebhookSubscriptionActivePayload,
  context: Readonly<RouterContextProvider>,
) {
  const db = context.get(dbContext)
  const env = context.get(envContext)

  try {
    const productId = event.data.productId
    const productConfig = Object.values(config.payments.products).find(
      (product) =>
        import.meta.env.PROD
          ? product.polarProductId.production === productId
          : product.polarProductId.preview === productId,
    )
    if (!productConfig) {
      throw new Error("Product not found")
    }
    const user = await getOrCreateUserByEmail(db, event.data.customer.email)
    const userRoleToGrant = productConfig.userRoleToGrant
    if (await hasUserRole(db, user.id, userRoleToGrant)) {
      throw new Error("User already has access")
    }
    await grantUserRole(db, user.id, userRoleToGrant)
    await sendAccessGrantedEmail({
      to: user.email,
      env,
      productName: productConfig.name,
    })
    return new Response("Payment success", { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      // Expected errors, prevent retrying the webhook by returning HTTP 200
      if (error.message === "User already has access") {
        return new Response(error.message, { status: 200 })
      }
      if (error.message === "Product not found") {
        await sendAccessFailureEmail({
          to: event.data.customer.email,
          env,
        })
        return new Response(error.message, { status: 200 })
      }
    }
    throw error
  }
}

export async function onPaymentRevoked(
  event: WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload,
  context: Readonly<RouterContextProvider>,
) {
  const db = context.get(dbContext)
  const env = context.get(envContext)

  try {
    const productId = event.data.productId
    const productConfig = Object.values(config.payments.products).find(
      (product) =>
        import.meta.env.PROD
          ? product.polarProductId.production === productId
          : product.polarProductId.preview === productId,
    )
    if (!productConfig) {
      throw new Error("Product not found")
    }
    const user = await getUserByEmail(db, event.data.customer.email)
    if (!user) {
      throw new Error("User not found")
    }
    const userRoleToRevoke = productConfig.userRoleToGrant
    await revokeUserRole(db, user.id, userRoleToRevoke)
    await sendAccessRevokedEmail({
      to: user.email,
      env,
      productName: productConfig.name,
    })
    return new Response("Payment revoked", { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      // Expected errors, prevent retrying the webhook by returning HTTP 200
      if (["User not found", "Product not found"].includes(error.message)) {
        return new Response(error.message, { status: 200 })
      }
    }
    throw error
  }
}
