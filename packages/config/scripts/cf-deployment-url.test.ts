import { describe, expect, it } from "vitest"

import { deploymentUrlFromCfOutput, firstHttpsUrl } from "./cf-deployment-url.ts"

describe("firstHttpsUrl", () => {
  it("reads a nested workers.dev URL from JSON", () => {
    expect(
      firstHttpsUrl({
        result: {
          preview_urls: ["https://abc123-pagezero.example.workers.dev"],
        },
      }),
    ).toBe("https://abc123-pagezero.example.workers.dev")
  })
})

describe("deploymentUrlFromCfOutput", () => {
  it("parses JSON stdout", () => {
    expect(
      deploymentUrlFromCfOutput(JSON.stringify({ url: "https://pagezero.example.workers.dev" })),
    ).toBe("https://pagezero.example.workers.dev")
  })

  it("extracts a workers.dev URL from mixed cf deploy logs", () => {
    const output = `
◆  Deploy
│  Uploaded pagezero (1.2 sec)
│  Deployed pagezero triggers (0.4 sec)
│    https://pagezero.example.workers.dev
│  Current Version ID: 11111111-1111-1111-1111-111111111111
◆  Deploy complete
`
    expect(deploymentUrlFromCfOutput(output)).toBe("https://pagezero.example.workers.dev")
  })
})
