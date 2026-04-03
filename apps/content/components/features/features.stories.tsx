import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Archive,
  ArrowRightCircle,
  Building2,
  RefreshCw,
  TestTube,
  Zap,
} from "lucide-react"
import { Link } from "@/ui/link"
import { Features } from "./features"

const meta = {
  title: "Apps/Content/Features",
  component: Features,
  parameters: {},
  decorators: [
    (Story) => (
      <div className="container mx-auto">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Features>

export default meta
type Story = StoryObj<typeof meta>

const icons = [
  <Building2 key={1} />,
  <Archive key={2} />,
  <ArrowRightCircle key={3} />,
  <RefreshCw key={4} />,
  <TestTube key={5} />,
  <Zap key={6} />,
]

export const Default: Story = {
  render: (args) => (
    <Features {...args}>
      {Array.from(Array(6)).map((_, index) => {
        const title = faker.lorem.word()
        return (
          <Features.Item
            title={title}
            key={title}
            cta={
              <Link href={faker.internet.url()} size="sm" underline="hover">
                Learn more →
              </Link>
            }
            icon={icons[index]}
          >
            {faker.lorem.paragraph()}
          </Features.Item>
        )
      })}
    </Features>
  ),
}
