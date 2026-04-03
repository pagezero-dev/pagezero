import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Label } from "../label"
import { Checkbox } from "./checkbox"

const meta = {
  title: "Packages/UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="default" {...args} />
      <Label htmlFor="default">Default checkbox</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked {...args} />
      <Label htmlFor="checked">Checked by default</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled {...args} />
      <Label htmlFor="disabled">Disabled checkbox</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked {...args} />
      <Label htmlFor="disabled-checked">Disabled and checked</Label>
    </div>
  ),
}

export const WithinBox: Story = {
  render: (args) => (
    <Label
      htmlFor="with-border"
      className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
    >
      <Checkbox
        id="with-border"
        defaultChecked
        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        {...args}
      />
      <div className="grid gap-1.5 font-normal">
        <p className="font-medium text-sm leading-none">Enable notifications</p>
        <p className="text-muted-foreground text-sm">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  ),
}
