import { reactRouter } from "@react-router/dev/vite"
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import mdx from "@mdx-js/rollup"
import rehypeHighlight from "rehype-highlight"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import { visualizer } from "rollup-plugin-visualizer"
import { getLoadContext } from "./load-context"

const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  ssr: {
    noExternal: ["@docsearch/react"],
  },
  plugins: [
    ...(!process.env.VITEST && !isStorybook
      ? [
          mdx({
            providerImportSource: "@mdx-js/react",
            rehypePlugins: [rehypeHighlight, rehypeMdxCodeProps],
          }),
          cloudflareDevProxy({ getLoadContext }),
          reactRouter(),
        ]
      : []),
    ...(process.env.CI
      ? []
      : [
          visualizer({
            brotliSize: true,
            // `emitFile` is necessary since Remix builds more than one bundle!
            emitFile: true,
          }),
        ]),
    tsconfigPaths(),
  ],
  test: {
    include: ["app/**/*.test.{ts,tsx}"],
    setupFiles: ["./setup.vitest.ts"],
    // Will call .mockRestore() on all spies before each test. This will
    // clear mock history and reset its implementation to the original one.
    restoreMocks: true,

    // Automatically assign environment based on globs.
    // The first match will be used.
    environmentMatchGlobs: [["app/**/*.tsx", "jsdom"]],
    coverage: {
      include: ["app/**/*.{ts,tsx}"],
      reporter: ["text"],
      reportsDirectory: "./.reports/tests-coverage",
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
  },
})
