import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import { Section } from "./section"

const meta = {
  title: "Apps/Content/Section",
  component: Section,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  },
}
