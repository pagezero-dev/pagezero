import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import tailwindAnimate from "tailwindcss-animate"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", ".storybook/preview.ts"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [tailwindAnimate],
  darkMode: ["selector"],
} satisfies Config
