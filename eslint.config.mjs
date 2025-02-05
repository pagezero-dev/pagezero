import { includeIgnoreFile } from "@eslint/compat"
import typescriptEslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11Y from "eslint-plugin-jsx-a11y"
import _import from "eslint-plugin-import"
import jestDom from "eslint-plugin-jest-dom"
import testingLibrary from "eslint-plugin-testing-library"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pluginJs from "@eslint/js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
  // Ignore files
  includeIgnoreFile(gitignorePath),
  // All files
  {
    plugins: {
      import: _import,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ..._import.flatConfigs.recommended.rules,
      ...pluginJs.configs.recommended.rules,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptEslint.parser,
    },
    plugins: {
      "@typescript-eslint": typescriptEslint.plugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  // React files
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parser: typescriptEslint.parser,
    },
    plugins: {
      react,
      "jsx-a11y": jsxA11Y,
    },
    rules: {
      ...react.configs.flat["jsx-runtime"].rules,
      ...jsxA11Y.flatConfigs.recommended.rules,
    },
  },
  // Vitest files
  {
    files: ["**/*.test.{ts,tsx}"],
    plugins: {
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
    },
    rules: {
      ...jestDom.configs["flat/recommended"].rules,
      ...testingLibrary.configs.react.rules,
    },
  },
  // Storybook files
  {
    files: ["**/*.stories.{ts,tsx}", ".storybook/*.ts"],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },
]
