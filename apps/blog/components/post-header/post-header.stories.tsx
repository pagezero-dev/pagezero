import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PostHeader } from "./post-header"

const meta = {
  title: "Apps/Blog/PostHeader",
  component: PostHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-prose px-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: faker.lorem.words(4),
    date: faker.date.recent(),
    imgSrc: faker.image.url(),
    author: {
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      imageSrc: faker.image.avatar(),
    },
  },
}
