export async function validateTurnstile({
  secret,
  token,
  ip,
}: {
  secret: string
  token?: string
  ip?: string | null
}) {
  const body = new FormData()
  body.append("secret", secret)
  body.append("response", token ?? "")
  body.append("remoteip", ip ?? "")

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  )

  const outcome = await result.json<{ success: boolean }>()
  if (outcome.success) {
    return true
  }
  return false
}
