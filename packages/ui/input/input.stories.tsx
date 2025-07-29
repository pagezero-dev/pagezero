import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Input } from "./input"

const meta = {
  title: "Packages/UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    placeholder: "With value",
    defaultValue: "Default text",
  },
}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Email address",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Password",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter a number",
  },
}

export const Invalid: Story = {
  args: {
    placeholder: "Invalid input",
    "aria-invalid": true,
  },
}

export const WithCustomWidth: Story = {
  args: {
    placeholder: "Custom width",
    className: "w-64",
  },
}
