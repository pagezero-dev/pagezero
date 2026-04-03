import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Testimonials } from "./testimonials"

const meta = {
  title: "Apps/Content/Testimonials",
  component: Testimonials,
  parameters: {},
  decorators: [
    (Story) => (
      <div className="container mx-auto">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Testimonials>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: Array.from(Array(9)).map(() => ({
      quote: faker.lorem.paragraph({ min: 1, max: 3 }),
      url: faker.internet.url(),
      author: {
        name: faker.person.firstName(),
        imageSrc: faker.image.avatar(),
        id: faker.lorem.word(),
      },
    })),
  },
}

export const Incomplete: Story = {
  args: {
    items: Array.from(Array(9)).map(() => ({
      quote: faker.lorem.paragraph({ min: 1, max: 3 }),
      author: {
        name: faker.person.firstName(),
      },
    })),
  },
}
