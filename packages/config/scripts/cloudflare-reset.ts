import { basename } from "node:path"

import { file, write } from "bun"

const projectName = basename(process.cwd())

console.log(`🔄 Resetting Cloudflare identity for "${projectName}"...`)

const productionPath = "./packages/config/production.ts"
const previewPath = "./packages/config/preview.ts"

let production = await file(productionPath).text()
production = production.replace(
  /const workerName = "[^"]+"/,
  `const workerName = ${JSON.stringify(projectName)}`,
)
production = production.replace(/\n\s*id: "[0-9a-f-]+",/, "")
production = production.replace(
  /CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "[^"]*"/,
  `CLOUDFLARE_TURNSTILE_PUBLIC_KEY: ""`,
)
production = production.replace(/NEWSLETTER_SEGMENT_ID: "[^"]*"/, `NEWSLETTER_SEGMENT_ID: ""`)
await write(productionPath, production)

let preview = await file(previewPath).text()
preview = preview.replace(/\n\s*id: "[0-9a-f-]+",/, "")
await write(previewPath, preview)

console.log(`✅ Finished resetting Cloudflare identity for "${projectName}".`)
