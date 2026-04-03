import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Label } from "../label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta = {
  title: "Packages/UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option1" {...args}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option1" className="flex gap-6" {...args}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option1" {...args}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="d1" />
        <Label htmlFor="d1">Enabled Option</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option2" id="d2" disabled />
        <Label htmlFor="d2" className="opacity-50">
          Disabled Option
        </Label>
      </div>
    </RadioGroup>
  ),
}
