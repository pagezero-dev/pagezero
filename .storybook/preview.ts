import type { Preview } from "@storybook/react"
import { withThemeByClassName } from "@storybook/addon-themes"

import "../app/styles/index.css"

export const decorators = [
  withThemeByClassName({
    themes: {
      light: "light text-gray-900 bg-white",
      dark: "dark test-white bg-neutral-900",
    },
    defaultTheme: "light",
  }),
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    viewport: {
      viewports: {
        xs: {
          name: "XS (mobile)",
          styles: {
            width: "375px",
            height: "687px",
          },
        },
        sm: {
          name: "SM (mobile horizontal)",
          styles: {
            width: "687px",
            height: "375px",
          },
        },
        md: {
          name: "MD (tablet)",
          styles: {
            width: "769px",
            height: "1024px",
          },
        },
        lg: {
          name: "LG (tablet horizontal)",
          styles: {
            width: "1025px",
            height: "768px",
          },
        },
        xl: {
          name: "XL (small desktop)",
          styles: {
            width: "1281px",
            height: "720px",
          },
        },
        "2xl": {
          name: "2XL (large desktop desktop)",
          styles: {
            width: "1537px",
            height: "864px",
          },
        },
      },
    },
  },
}

export default preview
