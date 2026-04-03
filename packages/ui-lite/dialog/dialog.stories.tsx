import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/ui/button"
import { Dialog } from "./dialog"

const meta = {
  title: "Packages/UI Lite/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    content: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: (
      <Dialog.Content
        title={faker.lorem.words(2)}
        description={faker.lorem.sentence()}
        onOk={() => {}}
        onCancel={() => {}}
      >
        {faker.lorem.paragraph()}
      </Dialog.Content>
    ),
    children: <Button variant="outline">Open dialog</Button>,
  },
}

export const Minimal: Story = {
  args: {
    content: (
      <Dialog.Content
        title={faker.lorem.words(2)}
        description={faker.lorem.sentence()}
        onOk={() => {}}
      />
    ),
    children: <Button variant="outline">Open dialog</Button>,
  },
}
