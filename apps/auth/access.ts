import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

export const userRoles = ["premium", "elite"] as const

export type PaidRole = (typeof userRoles)[number]

const statement = {
  ...defaultStatements,
  content: ["viewPremium", "viewElite"],
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({})

export const admin = ac.newRole({
  ...adminAc.statements,
})

export const premium = ac.newRole({
  content: ["viewPremium"],
})

export const elite = ac.newRole({
  content: ["viewPremium", "viewElite"],
})

export type ContentPermission = (typeof statement.content)[number]
