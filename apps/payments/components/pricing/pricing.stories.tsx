import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/ui/button"
import { Pricing } from "./pricing"

const meta = {
  title: "Apps/Payments/Pricing",
  component: Pricing,
  decorators: [
    (Story) => (
      <div className="container mx-auto mt-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Pricing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Pricing>
      <Pricing.Plan
        name="Basic"
        price="$9"
        period="/month"
        description="Perfect for individuals getting started"
        features={[
          "Up to 5 projects",
          "10GB storage",
          "Email support",
          "Basic analytics",
          "Mobile app access",
        ]}
        cta={
          <Button className="w-full" variant="outline" size="lg">
            Get Started
          </Button>
        }
      />

      <Pricing.Plan
        name="Pro"
        price="$29"
        period="/month"
        description="Best for growing teams and businesses"
        features={[
          "Unlimited projects",
          "100GB storage",
          "Priority support",
          "Advanced analytics",
          "Team collaboration",
          "API access",
          "Custom integrations",
        ]}
        highlight="Most Popular"
        cta={
          <Button className="w-full" variant="default" size="lg">
            Start Free Trial
          </Button>
        }
      />

      <Pricing.Plan
        name="Enterprise"
        price="$99"
        period="/month"
        description="For large organizations with advanced needs"
        features={[
          "Everything in Pro",
          "Unlimited storage",
          "24/7 phone support",
          "Custom analytics",
          "Advanced security",
          "SSO integration",
          "Dedicated account manager",
          "Custom contracts",
        ]}
        cta={
          <Button className="w-full" variant="outline" size="lg">
            Contact Sales
          </Button>
        }
      />
    </Pricing>
  ),
}

export const SinglePlan: Story = {
  render: () => (
    <Pricing>
      <Pricing.Plan
        name="Premium"
        price="$49"
        period="/month"
        description="The only plan you need"
        features={[
          "All features included",
          "Unlimited everything",
          "24/7 support",
          "Priority updates",
        ]}
        highlight="Best Value"
        cta={
          <Button className="w-full" variant="default" size="lg">
            Subscribe Now
          </Button>
        }
      />
    </Pricing>
  ),
}

export const WithoutHighlightBadge: Story = {
  render: () => (
    <Pricing>
      <Pricing.Plan
        name="Standard"
        price="$19"
        period="/month"
        description="All the essentials you need"
        features={["Feature 1", "Feature 2", "Feature 3"]}
        cta={
          <Button className="w-full" variant="outline" size="lg">
            Get Started
          </Button>
        }
      />
    </Pricing>
  ),
}
