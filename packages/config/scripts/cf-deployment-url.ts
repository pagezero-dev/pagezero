const preferredKeys = [
  "url",
  "preview_url",
  "deployment_url",
  "workers_dev_url",
  "preview_urls",
  "deployment_urls",
  "urls",
]

const httpsUrl = /https:\/\/[^\s"'<>\\]+/g

function stripTrailingPunctuation(url: string) {
  return url.replace(/[),.;]+$/u, "")
}

export function firstHttpsUrl(value: unknown): string | undefined {
  if (typeof value === "string" && value.startsWith("https://")) {
    return value
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = firstHttpsUrl(item)
      if (url) {
        return url
      }
    }
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    for (const key of preferredKeys) {
      const url = firstHttpsUrl(record[key])
      if (url) {
        return url
      }
    }
    for (const nested of Object.values(record)) {
      const url = firstHttpsUrl(nested)
      if (url) {
        return url
      }
    }
  }
}

function preferredUrl(urls: string[]) {
  const cleaned = urls.map(stripTrailingPunctuation)
  return (
    cleaned.find((url) => url.includes(".workers.dev") || url.includes(".cloudflare.app")) ??
    cleaned[0]
  )
}

export function deploymentUrlFromCfOutput(text: string): string | undefined {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  try {
    const fromJson = firstHttpsUrl(JSON.parse(trimmed))
    if (fromJson) {
      return fromJson
    }
  } catch {
    // cf deploy writes progress on stderr; mixed logs are not JSON.
  }

  const urls = trimmed.match(httpsUrl) ?? []
  return preferredUrl(urls)
}

if (import.meta.main) {
  const text = await Bun.stdin.text()
  const url = deploymentUrlFromCfOutput(text)
  if (!url) {
    console.error("Could not find a deployment URL in cf output:")
    console.error(text)
    process.exit(1)
  }
  console.log(url)
}
