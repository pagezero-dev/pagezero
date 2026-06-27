import type { StorybookConfig } from "@storybook/tanstack-react"

const config: StorybookConfig = {
  stories: ["../{apps,packages}/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/tanstack-react",
    options: {},
  },
}
export default config
