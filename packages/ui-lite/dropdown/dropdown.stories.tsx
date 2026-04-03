import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/ui/button"
import { Dropdown } from "./dropdown"

const meta = {
  title: "Packages/UI Lite/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    menu: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menu: (
      <Dropdown.Menu>
        <Dropdown.MenuItem>
          <Settings className="h-5 w-5" />
          Item 1
        </Dropdown.MenuItem>
        <Dropdown.MenuItem>
          <User className="h-5 w-5" />
          Item 2
        </Dropdown.MenuItem>
        <Dropdown.MenuItem>
          <LogOut className="h-5 w-5" />
          Item 3
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    ),
    children: (
      <Button variant="outline">
        Click me!
        <ChevronDown className="h-5 w-5" />
      </Button>
    ),
  },
}
