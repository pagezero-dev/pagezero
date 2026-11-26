import { basename } from "node:path"

import { file, write } from "bun"

const projectName = basename(process.cwd())

console.log(`🔄 Resetting Cloudflare identity for "${projectName}"...`)

const configPaths = [
  "./packages/config/cloudflare/production.ts",
  "./packages/config/cloudflare/preview.ts",
]

for (const configPath of configPaths) {
  let config = await file(configPath).text()
  config = config.replace(
    /const workerName = "[^"]+"/,
    `const workerName = ${JSON.stringify(projectName)}`,
  )
  config = config.replaceAll(/\n\s*id: "(?!00000000)[0-9a-f-]+",/g, "")
  config = config.replace(
    /CLOUDFLARE_TURNSTILE_PUBLIC_KEY: "0x[^"]*"/,
    `CLOUDFLARE_TURNSTILE_PUBLIC_KEY: ""`,
  )
  config = config.replace(/NEWSLETTER_SEGMENT_ID: "f7ba881f[^"]*"/, `NEWSLETTER_SEGMENT_ID: ""`)
  await write(configPath, config)
}

console.log(`✅ Finished resetting Cloudflare identity for "${projectName}".`)
