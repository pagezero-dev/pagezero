/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import { routes } from "./apps/routes"

const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Third-party packages ship incomplete sourcemaps - nothing we can fix
        // https://github.com/vitejs/vite/issues/15012
        if (
          warning.message.includes(
            "Error when using sourcemap for reporting an error",
          )
        ) {
          return
        }
        warn(warning)
      },
    },
  },
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    }),
    ...(!process.env.VITEST && !isStorybook
      ? [
          cloudflare({ viteEnvironment: { name: "ssr" } }),
          tanstackStart({
            srcDirectory: "apps",
            router: {
              routesDirectory: ".",
              virtualRouteConfig: routes,
              generatedRouteTree: "routeTree.gen.ts",
            },
          }),
          react(),
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
    // `cloudflare:workers` is a Workers-runtime virtual module that Vite cannot
    // resolve in the test environment. Alias it to a stub so modules importing
    // `env` can be loaded; tests can still override it with `vi.mock`.
    alias: {
      "cloudflare:workers": new URL(
        "./packages/cloudflare/test/cloudflare-workers.stub.ts",
        import.meta.url,
      ).pathname,
    },

    // Restores all original implementations on spies created manually
    restoreMocks: true,

    // Clears mocks history
    clearMocks: true,

    coverage: {
      include: ["{apps,packages}/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.tsx"],
      reporter: ["text", "text-summary"],
      reportsDirectory: "./.reports/tests-coverage",
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },

    projects: [
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
