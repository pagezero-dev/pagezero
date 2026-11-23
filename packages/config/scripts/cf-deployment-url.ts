/**
 * `cf previews deploy` prints JSON on stdout:
 * `{ preview_urls, deployment_urls, ... }`. Progress stays on stderr.
 */
export function previewUrlFromCfJson(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return
  }
  const record = value as Record<string, unknown>
  for (const key of ["preview_urls", "deployment_urls"]) {
    const urls = record[key]
    if (Array.isArray(urls) && typeof urls[0] === "string" && urls[0].startsWith("https://")) {
      return urls[0]
    }
  }
}

if (import.meta.main) {
  const json = await new Response(Bun.stdin).json()
  const url = previewUrlFromCfJson(json)
  if (!url) {
    console.error("Could not find a preview URL in cf previews deploy JSON:")
    console.error(json)
    process.exit(1)
  }
  console.log(url)
}
