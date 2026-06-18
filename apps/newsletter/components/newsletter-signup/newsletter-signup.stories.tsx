import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NewsletterSignup } from "./newsletter-signup"

const meta = {
  title: "Apps/Newsletter/NewsletterSignup",
  component: NewsletterSignup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <div className="p-8">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof NewsletterSignup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
