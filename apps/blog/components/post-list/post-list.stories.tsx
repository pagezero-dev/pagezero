import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { BlogPostSummary } from "@/blog/types"
import { PostList } from "./post-list"

function createPost(): BlogPostSummary {
  return {
    slug: faker.lorem.slug(),
    title: faker.lorem.words(4),
    description: faker.lorem.paragraph(),
    date: faker.date.recent().toISOString().slice(0, 10),
    imgSrc: faker.image.url(),
    author: {
      name: faker.person.fullName(),
      imageSrc: faker.image.avatar(),
      role: faker.person.jobTitle(),
    },
  }
}

const meta = {
  title: "Apps/Blog/PostList",
  component: PostList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    posts: Array.from({ length: 6 }, createPost),
  },
}
