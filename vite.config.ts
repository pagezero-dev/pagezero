/// <reference types="vitest/config" />
import path from "node:path"

import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, normalizePath } from "vite"

import { routes } from "./apps/routes.ts"

// import config from "./packages/config"

const isStorybook = process.argv[1]?.includes("storybook")

/**
 * `@cloudflare/vite-plugin` adds every file imported by `cloudflare.config.ts`
 * to `server.fs.deny`. `packages/config` is also imported by the Worker via
 * `@/config`, so allow those files while still denying `cloudflare.config.ts`
 * and env files. Deny is checked before `server.fs.allow`.
 */
function allowAppConfig() {
  return {
    name: "allow-app-config",
    configResolved(config: import("vite").ResolvedConfig) {
      const appConfigDir = normalizePath(path.resolve(config.root, "packages/config"))
      const resolved = config as typeof config & {
        fsDenyGlob: (filePath: string) => boolean
      }
      const deny = resolved.fsDenyGlob
      resolved.fsDenyGlob = (filePath) => {
        if (filePath === appConfigDir || filePath.startsWith(`${appConfigDir}/`)) {
          return false
        }
        return deny(filePath)
      }
    },
  }
}

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
        if (warning.message.includes("Error when using sourcemap for reporting an error")) {
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
            // Enables prerendering for selected pages and sitemap generation
            // prerender: {
            //   enabled: true,
            //   crawlLinks: true,
            //   filter: ({ path }) =>
            //     ["/", "/payments/success"].includes(path) ||
            //     ["/blog", "/legal"].some((prefix) => path.startsWith(prefix)),
            // },
            // sitemap: {
            //   enabled: true,
            //   host: config.core.websiteUrl,
            // },
          }),
          react(),
          allowAppConfig(),
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

    // Bun drops Zod's `export { z }` namespace re-export unless Vite inlines it
    server: {
      deps: {
        inline: ["zod"],
      },
    },

    // Vitest 5.1 forks use child.channel.unref(), which Bun 1.4 does not implement
    pool: "threads",

    // Restores all original implementations on spies created manually
    restoreMocks: true,

    // Clears mocks history
    clearMocks: true,

    coverage: {
      // V8 coverage requires a V8 runtime; Bun is JavaScriptCore
      provider: "istanbul",
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
