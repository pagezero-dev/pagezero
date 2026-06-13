import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PostSummary } from "./post-summary"

const meta = {
  title: "Apps/Blog/PostSummary",
  component: PostSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PostSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    date: faker.date.recent(),
    imgSrc: faker.image.url(),
    author: {
      name: faker.person.firstName(),
      imageSrc: faker.image.avatar(),
      role: faker.lorem.word(),
    },
  },
}
