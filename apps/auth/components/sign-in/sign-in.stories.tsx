import type { Meta, StoryObj } from "@storybook/react-vite"
// import { fn } from "@storybook/test"
// import { faker } from "@faker-js/faker"
import { SignIn } from "./sign-in"

const meta = {
  title: "Apps/User/SignIn",
  component: SignIn,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen flex-col items-center justify-center">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  args: {
    // onClick: fn()
  },
  argTypes: {
    // children: { control: false },
  },
} satisfies Meta<typeof SignIn>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Verify: Story = {
  args: {
    email: "test@test.com",
  },
}

export const Invalid: Story = {
  args: {
    error: "Invalid email or password",
  },
}

export const Success: Story = {
  args: {
    success: "Email sent successfully",
  },
}
