import {
  fixupConfigRules,
  fixupPluginRules,
  includeIgnoreFile,
} from "@eslint/compat"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11Y from "eslint-plugin-jsx-a11y"
import _import from "eslint-plugin-import"
import jestDom from "eslint-plugin-jest-dom"
import testingLibrary from "eslint-plugin-testing-library"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  includeIgnoreFile(gitignorePath),
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "prettier",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
    ),
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      react: fixupPluginRules(react),
      "react-hooks": fixupPluginRules(reactHooks),
      "jsx-a11y": fixupPluginRules(jsxA11Y),
      import: fixupPluginRules(_import),
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
      storybook,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        typescript: true,
        node: true,
      },
    },

    rules: {
      "import/order": "error",
    },
  },
  ...compat
    .extends("plugin:jest-dom/recommended", "plugin:testing-library/react")
    .map((config) => ({
      ...config,
      files: ["app/**/*.test.{ts,tsx}"],
    })),
  ...compat.extends("plugin:storybook/recommended").map((config) => ({
    ...config,
    files: ["app/modules/ui/**/*.stories.{ts,tsx}", ".storybook/*.ts"],
  })),
]
