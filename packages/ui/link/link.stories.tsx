import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ExternalLink } from "lucide-react"
import { fn } from "storybook/test"
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
    href: faker.internet.url(),
  },
}

export const Small: Story = {
  args: {
    children: "Link",
    size: "sm",
    href: faker.internet.url(),
  },
}

export const Large: Story = {
  args: {
    children: "Link",
    size: "lg",
    href: faker.internet.url(),
  },
}

export const NoUnderline: Story = {
  args: {
    children: "Link",
    underline: "none",
    href: faker.internet.url(),
  },
}

export const UnderlineOnHover: Story = {
  args: {
    children: "Link",
    underline: "hover",
    href: faker.internet.url(),
  },
}

export const Inlined: Story = {
  args: {
    children: faker.lorem.word(),
    href: faker.internet.url(),
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
    href: faker.internet.url(),
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
    children: <button type="button">Link</button>,
  },
}
