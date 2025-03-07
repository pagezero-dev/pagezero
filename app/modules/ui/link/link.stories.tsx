import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { faker } from "@faker-js/faker"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid"
import { Link } from "./link"

const meta = {
  title: "Core/Link",
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

export const Primary: Story = {
  args: {
    children: "Link",
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

export const Icon: Story = {
  args: {
    children: (
      <>
        <Link.Icon>
          <ArrowTopRightOnSquareIcon />
        </Link.Icon>
        {faker.lorem.word()}
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
