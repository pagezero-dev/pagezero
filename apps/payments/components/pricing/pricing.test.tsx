import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Button } from "@/ui/button"

import { Pricing } from "./pricing"

// Test data fixtures
const mockPlans = {
  basic: {
    name: "Basic",
    price: "$9",
    period: "/month",
    description: "Perfect for individuals getting started",
    features: [
      "Up to 5 projects",
      "10GB storage",
      "Email support",
      "Basic analytics",
      "Mobile app access",
    ],
  },
  pro: {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Best for growing teams and businesses",
    features: [
      "Unlimited projects",
      "100GB storage",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "API access",
      "Custom integrations",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "24/7 phone support",
      "Custom analytics",
      "Advanced security",
      "SSO integration",
      "Dedicated account manager",
      "Custom contracts",
    ],
  },
  minimal: {
    name: "Test",
    price: "$0",
    period: "/month",
    description: "Test plan",
    features: ["Feature 1"],
  },
}

describe("<Pricing />", () => {
  it("renders pricing plans", () => {
    render(
      <Pricing>
        <Pricing.Plan
          {...mockPlans.basic}
          cta={
            <Button className="w-full" variant="outline" size="lg">
              Get Started
            </Button>
          }
        />
        <Pricing.Plan
          {...mockPlans.pro}
          highlight="Most Popular"
          cta={
            <Button className="w-full" variant="default" size="lg">
              Start Free Trial
            </Button>
          }
        />
        <Pricing.Plan
          {...mockPlans.enterprise}
          cta={
            <Button className="w-full" variant="outline" size="lg">
              Contact Sales
            </Button>
          }
        />
      </Pricing>,
    )

    // Check that all plan names are rendered
    expect(screen.getByText("Basic")).toBeInTheDocument()
    expect(screen.getByText("Pro")).toBeInTheDocument()
    expect(screen.getByText("Enterprise")).toBeInTheDocument()
  })

  it("displays plan prices", () => {
    render(
      <Pricing>
        <Pricing.Plan {...mockPlans.basic} cta={<Button>Get Started</Button>} />
        <Pricing.Plan {...mockPlans.pro} cta={<Button>Get Started</Button>} />
        <Pricing.Plan
          {...mockPlans.enterprise}
          cta={<Button>Get Started</Button>}
        />
      </Pricing>,
    )

    // Check that prices are displayed
    expect(screen.getByText("$9")).toBeInTheDocument()
    expect(screen.getByText("$29")).toBeInTheDocument()
    expect(screen.getByText("$99")).toBeInTheDocument()
  })

  it("shows highlight badge with custom label", () => {
    render(
      <Pricing>
        <Pricing.Plan
          {...mockPlans.pro}
          highlight="Most Popular"
          cta={<Button>Start Free Trial</Button>}
        />
      </Pricing>,
    )

    expect(screen.getByText("Most Popular")).toBeInTheDocument()
  })

  it("shows highlight badge with different custom label", () => {
    render(
      <Pricing>
        <Pricing.Plan
          {...mockPlans.pro}
          highlight="Best Value"
          cta={<Button>Start Free Trial</Button>}
        />
      </Pricing>,
    )

    expect(screen.getByText("Best Value")).toBeInTheDocument()
  })

  it("does not show highlight badge when not specified", () => {
    render(
      <Pricing>
        <Pricing.Plan {...mockPlans.basic} cta={<Button>Get Started</Button>} />
      </Pricing>,
    )

    expect(screen.queryByText("Most Popular")).not.toBeInTheDocument()
    expect(screen.queryByText("Best Value")).not.toBeInTheDocument()
  })

  it("displays call-to-action buttons", () => {
    render(
      <Pricing>
        <Pricing.Plan
          {...mockPlans.minimal}
          cta={<Button>Get Started</Button>}
        />
        <Pricing.Plan
          {...mockPlans.minimal}
          cta={<Button>Start Free Trial</Button>}
        />
        <Pricing.Plan
          {...mockPlans.minimal}
          cta={<Button>Contact Sales</Button>}
        />
      </Pricing>,
    )

    expect(screen.getByText("Get Started")).toBeInTheDocument()
    expect(screen.getByText("Start Free Trial")).toBeInTheDocument()
    expect(screen.getByText("Contact Sales")).toBeInTheDocument()
  })

  it("renders plan features", () => {
    render(
      <Pricing>
        <Pricing.Plan {...mockPlans.basic} cta={<Button>Get Started</Button>} />
        <Pricing.Plan {...mockPlans.pro} cta={<Button>Get Started</Button>} />
        <Pricing.Plan
          {...mockPlans.enterprise}
          cta={<Button>Get Started</Button>}
        />
      </Pricing>,
    )

    expect(screen.getByText("Up to 5 projects")).toBeInTheDocument()
    expect(screen.getByText("Unlimited projects")).toBeInTheDocument()
    expect(screen.getByText("Everything in Pro")).toBeInTheDocument()
  })

  it("renders single plan", () => {
    const starter = {
      name: "Starter",
      price: "$5",
      period: "/month",
      description: "Basic plan for beginners",
      features: ["1 project", "5GB storage"],
    }

    render(
      <Pricing>
        <Pricing.Plan {...starter} cta={<Button>Start Now</Button>} />
      </Pricing>,
    )

    expect(screen.getByText("Starter")).toBeInTheDocument()
    expect(screen.getByText("$5")).toBeInTheDocument()
    expect(screen.getByText("Basic plan for beginners")).toBeInTheDocument()
    expect(screen.getByText("1 project")).toBeInTheDocument()
    expect(screen.getByText("Start Now")).toBeInTheDocument()
  })

  it("renders with no plans", () => {
    render(<Pricing />)
    expect(screen.queryByText("Basic")).not.toBeInTheDocument()
  })

  it("renders plan descriptions", () => {
    render(
      <Pricing>
        <Pricing.Plan {...mockPlans.pro} cta={<Button>Subscribe</Button>} />
      </Pricing>,
    )

    expect(
      screen.getByText("Best for growing teams and businesses"),
    ).toBeInTheDocument()
  })
})
