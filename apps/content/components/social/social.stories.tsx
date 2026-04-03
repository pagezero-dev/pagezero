import type { Meta, StoryObj } from "@storybook/react-vite"
import { Social } from "./social"

const meta = {
  title: "Apps/Content/Social",
  component: Social,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Social>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: {
    facebookUrl: "https://www.facebook.com",
    instagramUrl: "https://www.instagram.com",
    twitterUrl: "https://www.twitter.com",
    githubUrl: "https://www.github.com",
    youtubeUrl: "https://www.youtube.com",
  },
}

export const Selected: Story = {
  args: {
    twitterUrl: "https://www.twitter.com",
    githubUrl: "https://www.github.com",
    youtubeUrl: "https://www.youtube.com",
  },
}
