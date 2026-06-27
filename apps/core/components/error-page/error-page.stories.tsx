import type { Meta, StoryObj } from "@storybook/tanstack-react"
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

const applicationError = new Error("Something went wrong")
applicationError.name = "Application Error"

const notFoundError = new Error(
  "The page you're looking for doesn't exist or has been moved.",
)
notFoundError.name = "Page not found"

const serverError = new Error("Failed to load data")
serverError.name = "Server Error"

export const Default: Story = {
  args: {
    error: applicationError,
  },
}

export const NotFound: Story = {
  args: {
    error: notFoundError,
    action: <a href="/">Go home</a>,
  },
}

export const WithDetails: Story = {
  args: {
    error: serverError,
    details: serverError.stack,
  },
}
