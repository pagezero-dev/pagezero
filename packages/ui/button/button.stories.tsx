import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Cog } from "lucide-react"
import { fn } from "storybook/test"
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

export const Destructive: Story = {
  args: {
    variant: "destructive",
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

export const Icon: Story = {
  args: {
    variant: "secondary",
    size: "icon",
    children: <Cog />,
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Cog />
        Button
      </>
    ),
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    children: "Button",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
    children: "Button",
  },
}

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href={faker.internet.url()}>Button</a>,
  },
}
