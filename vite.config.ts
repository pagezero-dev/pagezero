import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import mdx from "@mdx-js/rollup"
import { visualizer } from "rollup-plugin-visualizer"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"

const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    ...(!process.env.VITEST && !isStorybook
      ? [
          mdx({
            providerImportSource: "@mdx-js/react",
          }),
          cloudflare({ viteEnvironment: { name: "ssr" } }),
          reactRouter(),
        ]
      : []),
    ...(!process.env.CI
      ? [
          visualizer({
            brotliSize: true,
            emitFile: true,
          }),
        ]
      : []),
  ],
  test: {
    // Will call .mockRestore() on all spies before each test. This will
    // clear mock history and reset its implementation to the original one.
    restoreMocks: true,

    coverage: {
      include: ["{apps,packages}/**/*.{ts,tsx}"],
      reporter: ["text"],
      reportsDirectory: "./.reports/tests-coverage",
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },

    workspace: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["{apps,packages}/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "happy-dom",
          include: ["{apps,packages}/**/*.test.tsx"],
          setupFiles: ["./setup.dom.vitest.ts"],
        },
      },
    ],
  },
})
