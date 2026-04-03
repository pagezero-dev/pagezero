import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown } from "lucide-react"
import { Button } from "@/ui/button"
import { Dropdown } from "@/ui-lite/dropdown"
import { Header } from "./header"

const meta = {
  title: "Apps/Content/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    logo: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

const baseConfig = {
  logo: (
    <a href={faker.internet.url()} className="font-bold text-lg">
      PageZERO
    </a>
  ),
  children: (
    <>
      <Button variant="ghost" asChild>
        <a href={faker.internet.url()}>Pricing</a>
      </Button>
      <Button variant="ghost" asChild>
        <a href={faker.internet.url()}>About us</a>
      </Button>
      <Button variant="ghost" asChild>
        <a href={faker.internet.url()}>Blog</a>
      </Button>
      <Button variant="ghost" asChild>
        <a href={faker.internet.url()}>Docs</a>
      </Button>
      <Button variant="default" asChild>
        <a href={faker.internet.url()}>Log in</a>
      </Button>
    </>
  ),
}

export const Default: Story = {
  args: {
    ...baseConfig,
  },
}

export const SignedIn: Story = {
  args: {
    logo: baseConfig.logo,
    children: (
      <>
        <Button variant="ghost" asChild>
          <a href={faker.internet.url()}>Pricing</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href={faker.internet.url()}>About us</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href={faker.internet.url()}>Blog</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href={faker.internet.url()}>Docs</a>
        </Button>
        <Dropdown
          menu={
            <Dropdown.Menu align="end">
              <Dropdown.MenuItem>
                <button type="button">Settings</button>
              </Dropdown.MenuItem>
              <Dropdown.MenuItem>
                <button type="button">Profile</button>
              </Dropdown.MenuItem>
              <Dropdown.MenuItem>
                <button type="button">Sign out</button>
              </Dropdown.MenuItem>
            </Dropdown.Menu>
          }
        >
          <Button variant="outline">
            {faker.internet.email()} <ChevronDown className="h-5 w-5" />
          </Button>
        </Dropdown>
      </>
    ),
  },
}

export const Sticky: Story = {
  decorators: [
    (Story) => (
      <>
        <Story />
        <main className="container mx-auto text-lg">
          {Array.from(Array(20).keys()).map((index) => (
            <p key={index} className="mb-3">
              {faker.lorem.paragraph()}
            </p>
          ))}
        </main>
      </>
    ),
  ],
  args: {
    ...baseConfig,
    position: "sticky",
  },
}

export const Absolute: Story = {
  args: {
    ...baseConfig,
    position: "absolute",
  },
}
