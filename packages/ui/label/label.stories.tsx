import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "../checkbox"
import { Input } from "../input"
import { Label } from "./label"

const meta = {
  title: "Packages/UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Label>Default Label</Label>,
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="with-label" />
      <Label htmlFor="with-label">Label with Checkbox</Label>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="required">
        Required Field <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="required" required />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="group grid gap-1.5" data-disabled="true">
      <Label htmlFor="disabled">Disabled Label</Label>
      <Input type="text" id="disabled" disabled />
    </div>
  ),
}
