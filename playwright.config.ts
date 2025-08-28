import { defineConfig, devices } from "@playwright/test"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "dot" : "list",
  /* Limit the number of failures on CI to save resources */
  maxFailures: process.env.CI ? 5 : undefined,
  /* The output directory for files created during test execution. */
  outputDir: "./.reports/e2e-tests-results",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "e2e",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /.*smoke.spec.ts/,
    },
    {
      name: "smoke",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*smoke.spec.ts/,
    },
  ],

  /* Run your local dev server before starting the tests */
  ...(!process.env.TEST_PAGE_URL && {
    webServer: {
      command: process.env.CI ? "npm run preview" : "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      env: {
        CLOUDFLARE_ENV: "test",
      },
    },
  }),
})
