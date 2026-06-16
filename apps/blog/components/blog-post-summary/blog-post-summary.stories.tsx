import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BlogPostSummary } from "./blog-post-summary"

const meta = {
  title: "Apps/Blog/BlogPostSummary",
  component: BlogPostSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogPostSummary>

export default meta
type Story = StoryObj<typeof meta>

const author = {
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  imageSrc: faker.image.avatar(),
}

export const Summary: Story = {
  args: {
    variant: "summary",
    title: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    date: faker.date.recent(),
    imgSrc: faker.image.url(),
    author,
  },
}

export const Header: Story = {
  args: {
    variant: "header",
    title: faker.lorem.words(4),
    date: faker.date.recent(),
    imgSrc: faker.image.url(),
    author,
  },
  decorators: [
    (Story) => (
      <div className="max-w-prose px-5">
        <Story />
      </div>
    ),
  ],
}
