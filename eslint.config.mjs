import path from "node:path"
import { fileURLToPath } from "node:url"
import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import vitest from "@vitest/eslint-plugin"
import jestDom from "eslint-plugin-jest-dom"
import jsxA11Y from "eslint-plugin-jsx-a11y"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import testingLibrary from "eslint-plugin-testing-library"
import globals from "globals"
import typescriptEslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
  // Ignore files
  includeIgnoreFile(gitignorePath),

  // All files
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
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
      "react-hooks": reactHooks,
    },
    rules: {
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
      vitest,
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
    },
    rules: {
      ...jestDom.configs["flat/recommended"].rules,
      ...testingLibrary.configs["flat/react"].rules,
      ...vitest.configs.recommended.rules,
    },
  },

  // Storybook files
  ...storybook.configs["flat/recommended"],
]
