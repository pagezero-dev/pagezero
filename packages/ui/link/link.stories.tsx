import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { faker } from "@faker-js/faker"
import { ExternalLink } from "lucide-react"
import { Link } from "./link"

const meta = {
  title: "Packages/UI/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Link",
    size: "default",
  },
}

export const Small: Story = {
  args: {
    children: "Link",
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    children: "Link",
    size: "lg",
  },
}

export const Inlined: Story = {
  args: {
    children: faker.lorem.word(),
  },
  render: (args) => (
    <p>
      {faker.lorem.words()} <Link {...args} /> {faker.lorem.words()}
    </p>
  ),
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        {faker.lorem.word()}
        <ExternalLink />
      </>
    ),
  },
  render: (args) => (
    <p>
      {faker.lorem.words()} <Link {...args} /> {faker.lorem.words()}
    </p>
  ),
}

export const AsButton: Story = {
  args: {
    asChild: true,
    children: <button>Link</button>,
  },
}
