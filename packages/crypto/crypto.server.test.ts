import { describe, expect, it } from "vitest"
import { sign, verify } from "./crypto.server"

describe("crypto", () => {
  const testSecret = "test-secret-key"
  const testData = "hello world"

  it("signs and verifies data", async () => {
    const signature = await sign(testSecret, testData)
    expect(signature).toBeDefined()
    const isValid = await verify(testSecret, testData, signature)
    expect(isValid).toBe(true)
  })

  it("fails verification if the signature is invalid", async () => {
    const isValid = await verify(testSecret, testData, "invalid-signature")
    expect(isValid).toBe(false)
  })

  it("fails verification if the data is invalid", async () => {
    const signature = await sign(testSecret, testData)
    const isValid = await verify(testSecret, "invalid-data", signature)
    expect(isValid).toBe(false)
  })

  it("fails verification if the secret is invalid", async () => {
    const signature = await sign(testSecret, testData)
    const isValid = await verify("invalid-secret", testData, signature)
    expect(isValid).toBe(false)
  })
})
