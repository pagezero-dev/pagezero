import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Faq } from "./faq"

const meta = {
  title: "Apps/Content/Faq",
  component: Faq,
  decorators: [
    (Story) => (
      <div className="container mx-auto">
        <Story />
      </div>
    ),
  ],
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Faq>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: Array.from(Array(5)).map(() => ({
      question: faker.lorem.sentence(),
      answer: faker.lorem.paragraph(),
    })),
  },
}
