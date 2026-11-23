import { describe, expect, it } from "vitest"

import { previewUrlFromCfJson } from "./cf-deployment-url.ts"

describe("previewUrlFromCfJson", () => {
  it("prefers preview_urls", () => {
    expect(
      previewUrlFromCfJson({
        type: "preview",
        preview_urls: ["https://branch-pagezero.example.workers.dev"],
        deployment_urls: ["https://pagezero.example.workers.dev"],
      }),
    ).toBe("https://branch-pagezero.example.workers.dev")
  })

  it("falls back to deployment_urls", () => {
    expect(
      previewUrlFromCfJson({
        deployment_urls: ["https://pagezero.example.workers.dev"],
      }),
    ).toBe("https://pagezero.example.workers.dev")
  })
})
