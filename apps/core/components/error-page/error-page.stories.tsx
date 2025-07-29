import type { Meta, StoryObj } from "@storybook/react-vite"
import { ErrorPage } from "./error-page"

const meta = {
  title: "Apps/Core/ErrorPage",
  component: ErrorPage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Application error",
    error: new Error("Test error"),
  },
}

export const OnlyTitle: Story = {
  args: {
    title: "Application error",
  },
}

export const WithDescription: Story = {
  args: {
    title: "Application error",
    description: "Description of the error",
  },
}

export const HTTPError: Story = {
  args: {
    error: { status: 404, statusText: "Not Found", internal: true, data: null },
  },
}
