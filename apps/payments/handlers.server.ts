import type { WebhookOrderPaidPayload } from "@polar-sh/sdk/models/components/webhookorderpaidpayload"
import type { WebhookOrderRefundedPayload } from "@polar-sh/sdk/models/components/webhookorderrefundedpayload"
import type { WebhookSubscriptionActivePayload } from "@polar-sh/sdk/models/components/webhooksubscriptionactivepayload"
import type { WebhookSubscriptionRevokedPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionrevokedpayload"

import { grantUserRole, hasUserRole, revokeUserRole } from "@/auth/roles.server"
import { getOrCreateUserByEmail, getUserByEmail } from "@/auth/user.server"
import config from "@/config"
import { getAppMode } from "@/core"
import {
  sendAccessFailureEmail,
  sendAccessGrantedEmail,
  sendAccessRevokedEmail,
} from "@/email/templates.server"

type PaymentSuccessEvent = WebhookOrderPaidPayload | WebhookSubscriptionActivePayload
type PaymentRevokedEvent = WebhookOrderRefundedPayload | WebhookSubscriptionRevokedPayload

function getProductConfig(productId: string | null | undefined) {
  if (!productId) {
    return undefined
  }

  const mode = getAppMode() === "production" ? "production" : "preview"
  return Object.values(config.payments.products).find(
    (product) => product.polarProductId[mode] === productId,
  )
}

export async function onPaymentSuccess(event: PaymentSuccessEvent) {
  const email = event.data.customer.email
  if (!email) {
    throw new Error("Customer email not found")
  }

  const productConfig = getProductConfig(event.data.productId)
  if (!productConfig) {
    await sendAccessFailureEmail({ to: email })
    return
  }

  const user = await getOrCreateUserByEmail(email)
  const userRoleToGrant = productConfig.userRoleToGrant
  if (await hasUserRole(user.id, userRoleToGrant)) {
    return
  }

  await grantUserRole(user.id, userRoleToGrant)
  await sendAccessGrantedEmail({
    to: user.email,
    productName: productConfig.name,
  })
}

export async function onPaymentRevoked(event: PaymentRevokedEvent) {
  const email = event.data.customer.email
  if (!email) {
    throw new Error("Customer email not found")
  }

  const productConfig = getProductConfig(event.data.productId)
  if (!productConfig) {
    return
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return
  }

  await revokeUserRole(user.id, productConfig.userRoleToGrant)
  await sendAccessRevokedEmail({
    to: user.email,
    productName: productConfig.name,
  })
}
