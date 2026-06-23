import { basename } from "node:path"
import { file, write } from "bun"

const projectName = basename(process.cwd())

console.log(`🔄 Resetting wrangler.json for "${projectName}"...`)

const wranglerJson = await file("./wrangler.json").json()

wranglerJson.name = projectName
wranglerJson.d1_databases[0].database_name = `${projectName}-development`
wranglerJson.env.production.d1_databases[0].database_name = `${projectName}-production`
wranglerJson.env.preview.d1_databases[0].database_name = `${projectName}-preview`
wranglerJson.env.test.d1_databases[0].database_name = `${projectName}-test`
delete wranglerJson.env.production.d1_databases[0].database_id
delete wranglerJson.env.preview.d1_databases[0].database_id
wranglerJson.env.production.vars.CLOUDFLARE_TURNSTILE_PUBLIC_KEY = ""
wranglerJson.env.production.vars.NEWSLETTER_SEGMENT_ID = ""
wranglerJson.env.preview.vars.CLOUDFLARE_TURNSTILE_PUBLIC_KEY = ""
wranglerJson.env.preview.vars.NEWSLETTER_SEGMENT_ID = ""

await write("./wrangler.json", JSON.stringify(wranglerJson, null, 2))

console.log(`✅ Finished resetting wrangler.json for "${projectName}".`)
