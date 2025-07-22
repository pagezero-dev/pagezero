import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { faker } from "@faker-js/faker"
import { CogIcon } from "@heroicons/react/20/solid"
import { Button } from "./button"

const meta = {
  title: "Packages/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: "Button",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Button",
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Button",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Button",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Button",
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CogIcon className="h-5 w-5" />
        Button
      </>
    ),
  },
}

export const Large: Story = {
  args: {
    size: "large",
    children: "Button",
  },
}

export const Small: Story = {
  args: {
    size: "small",
    children: "Button",
  },
}

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href={faker.internet.url()}>Button</a>,
  },
}
