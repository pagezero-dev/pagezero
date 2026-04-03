import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Check, X } from "lucide-react"
import { Link } from "@/ui/link"
import { Badge } from "./badge"

const meta = {
  title: "Packages/UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Badge",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>
        <Check />
        Success
      </Badge>
      <Badge variant="destructive">
        <X />
        Error
      </Badge>
    </div>
  ),
}

export const WithLink: Story = {
  render: () => (
    <Badge asChild>
      <Link href={faker.internet.url()} underline="none">
        Link
      </Link>
    </Badge>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge className="text-xs">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="px-3 py-1 text-sm">Large</Badge>
    </div>
  ),
}
