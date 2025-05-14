import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  // Automatic cleanup from react testing library does not work with Vitest.
  // This is because react testing library expects `afterEach` to be globally available.
  // Vitest does not support this, so we need to manually cleanup.
  // Related issue: https://github.com/testing-library/vue-testing-library/issues/296
  cleanup()
})
