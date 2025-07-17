export const componentStoryTemplate = ({
  name,
  fileName,
}: {
  name: string
  fileName: string
}) => `

import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { faker } from "@faker-js/faker"
import { ${name} } from "./${fileName.toLowerCase()}"

const meta = {
  title: "${name}",
  component: ${name},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { 
    // onClick: fn()
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof ${name}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
  },
}
`
