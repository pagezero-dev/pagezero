/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
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
    tsconfigPaths(),
    tailwindcss(),
    ...(!process.env.VITEST && !isStorybook
      ? [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()]
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
