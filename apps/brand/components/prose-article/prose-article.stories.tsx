import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Heading, P } from "@/ui/typography"
import { ProseArticle } from "./prose-article"

const meta = {
  title: "Apps/Brand/ProseArticle",
  component: ProseArticle,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof ProseArticle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: faker.lorem.sentence(),
    children: (
      <>
        <Heading level={3}>Section heading</Heading>
        <P>{faker.lorem.paragraphs(2)}</P>
      </>
    ),
  },
}

export const WithoutTitle: Story = {
  args: {
    children: (
      <>
        <Heading level={3}>Section heading</Heading>
        <P>{faker.lorem.paragraphs(2)}</P>
      </>
    ),
  },
}
