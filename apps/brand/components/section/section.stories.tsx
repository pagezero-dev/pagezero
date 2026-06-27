import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/tanstack-react"
import { Badge } from "@/ui/badge"
import { Section } from "./section"

const meta = {
  title: "Apps/Brand/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
    badge: { control: false },
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

export const WithBadge: Story = {
  args: {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    badge: (
      <Badge variant="outline" className="px-3 py-2 text-muted-foreground">
        <span className="mr-1 size-3 rounded-full bg-amber-600" />
        Featured
      </Badge>
    ),
  },
}

export const MediumBackground: Story = {
  args: {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    background: "medium",
  },
}

export const DescriptionOnly: Story = {
  args: {
    description: faker.lorem.paragraph(),
  },
}
