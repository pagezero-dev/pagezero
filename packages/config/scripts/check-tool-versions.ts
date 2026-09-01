import { file, semver, spawnSync, version } from "bun"

const required = Object.fromEntries(
  (await file(".tool-versions").text())
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/)),
)

const node = spawnSync(["node", "-p", "process.versions.node"], {
  stdout: "pipe",
  stderr: "pipe",
})

const installed = {
  bun: version,
  nodejs: node.exitCode === 0 ? node.stdout.toString().trim() : "not found",
}

for (const [name, actual] of Object.entries(installed)) {
  const min = required[name]
  if (min && !semver.satisfies(actual, `>=${min}`)) {
    console.error(`Need ${name} >= ${min} (.tool-versions); got ${actual}.`)
    console.error("Run: asdf install")
    process.exit(1)
  }
}
