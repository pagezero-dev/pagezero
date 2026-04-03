import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/ui/button"
import { Hero } from "./hero"

const meta = {
  title: "Apps/Content/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: faker.lorem.sentence({ min: 4, max: 6 }),
    description: faker.lorem.paragraph(3),
    cta: (
      <>
        <Button asChild>
          <a href={faker.internet.url()}>Get started</a>
        </Button>
        <Button asChild variant="ghost">
          <a href={faker.internet.url()}>Learn more →</a>
        </Button>
      </>
    ),
  },
}
