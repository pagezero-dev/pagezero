import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"

const wranglerConfig = readFileSync("./wrangler.json", "utf-8")
const wranglerConfigJson = JSON.parse(wranglerConfig)

const localDbName = wranglerConfigJson.d1_databases[0].database_name

console.log(`🚀 Initializing local database ${localDbName}...`)
execSync(`wrangler d1 execute ${localDbName} --local --command="SELECT 1"`)
console.log("✅ Done")
