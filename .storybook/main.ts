import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../{apps,packages}/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
}
export default config
