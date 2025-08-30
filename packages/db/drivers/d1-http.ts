import type { DrizzleConfig } from "drizzle-orm"
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy"

interface Options {
  accountId: string
  databaseId: string
  token: string
}

interface D1Response {
  errors: { code: number; message: string }[]
  messages: { code: number; message: string }[]
  success: boolean
  result: { success: boolean; results: object[] }[]
}

export function drizzle(
  { accountId, databaseId, token }: Options,
  config?: DrizzleConfig,
) {
  return drizzleProxy(async (sql, params, method) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params, method }),
    })

    const data = await response.json<D1Response>()

    if (response.status !== 200)
      throw new Error(
        `Error from sqlite proxy server: ${response.status} ${response.statusText}\n${JSON.stringify(data)}`,
      )
    if (data.errors.length > 0 || !data.success)
      throw new Error(
        `Error from sqlite proxy server: \n${JSON.stringify(data)}}`,
      )

    const result = data.result[0]

    if (!result.success)
      throw new Error(
        `Error from sqlite proxy server: \n${JSON.stringify(data)}`,
      )

    // biome-ignore lint/suspicious/noExplicitAny: https://orm.drizzle.team/docs/get-started-sqlite#http-proxy
    return { rows: result.results.map((r: any) => Object.values(r)) }
  }, config)
}
