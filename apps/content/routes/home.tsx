import {
  Briefcase,
  Globe,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react"
import { Link } from "react-router"
import { CheckoutButton } from "@/payments/components/checkout-button"
import { Pricing } from "@/payments/components/pricing"
import { Button } from "@/ui/button"
import { Card, CardContent } from "@/ui/card"
import { P } from "@/ui/typography"
import { Faq } from "../components/faq"
import { Features } from "../components/features"
import { Hero } from "../components/hero"
import { AnimatedCyberpunkGrid } from "../components/hero/animated-backgrounds"
import { Section } from "../components/section"
import { Testimonials } from "../components/testimonials"

export default function Index() {
  return (
    <>
      <Hero
        title="Your Product Tagline Here"
        description="A brief description of what your product does and the value it provides to customers."
        cta={
          <>
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Learn More →</a>
            </Button>
          </>
        }
      >
        <AnimatedCyberpunkGrid />
      </Hero>

      <Section
        id="features"
        title="Why Choose Us"
        description="Highlight the key benefits and features that make your product stand out from the competition."
      >
        <Features>
          <Features.Item
            title="Feature One"
            icon={<Rocket />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the first key feature of your product. Explain how it
            benefits users and solves their problems. Include specific details
            about the functionality it provides and the pain points it
            addresses. Mention what makes this capability essential.
          </Features.Item>

          <Features.Item
            title="Feature Two"
            icon={<Shield />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the second key feature. Focus on the value proposition and
            what makes it unique. Explain how this feature compares to
            alternatives and why your approach is better. Include any relevant
            metrics that demonstrate its effectiveness.
          </Features.Item>

          <Features.Item
            title="Feature Three"
            icon={<Lightbulb />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the third key feature. Use clear, concise language that
            resonates with your target audience. Highlight the time or cost
            savings they can expect from using it. Paint a picture of how users
            will experience this in their daily workflow.
          </Features.Item>

          <Features.Item
            title="Feature Four"
            icon={<Briefcase />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the fourth key feature. Highlight specific use cases or
            scenarios where this feature shines. Mention any customization
            options or flexibility built into it. Provide examples of different
            user personas who benefit from this capability.
          </Features.Item>

          <Features.Item
            title="Feature Five"
            icon={<HeartHandshake />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the fifth key feature. Consider mentioning integrations,
            ease of use, or time savings. Explain how it works seamlessly with
            tools your users already rely on. Describe the onboarding experience
            and how quickly users can start seeing value.
          </Features.Item>

          <Features.Item
            title="Feature Six"
            icon={<Star />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the sixth key feature. Consider mentioning customer success
            stories or proven results. Share data points or testimonials that
            validate its impact. Explain how it contributes to the overall value
            proposition of your product.
          </Features.Item>

          <Features.Item
            title="Feature Seven"
            icon={<Zap />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the seventh key feature. Highlight performance, speed, or
            efficiency gains your product offers. Include specific numbers or
            benchmarks if available. Explain the technical foundation that
            enables this level of performance.
          </Features.Item>

          <Features.Item
            title="Feature Eight"
            icon={<Globe />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the eighth key feature. Mention global availability,
            scalability, or multi-platform support. Explain how your product
            adapts to different regions or needs. Highlight any infrastructure
            investments that ensure reliability at scale.
          </Features.Item>

          <Features.Item
            title="Feature Nine"
            icon={<Target />}
            cta={<Link to="/features">Learn more →</Link>}
          >
            Describe the ninth key feature. End with your strongest or most
            differentiating capability. Focus on what truly sets you apart from
            competitors in the market. Summarize the cumulative value users get
            from choosing your product.
          </Features.Item>
        </Features>
      </Section>

      <Section
        background="light"
        id="about"
        title="About Us"
        description="Share your story and build trust with potential customers."
      >
        <Card className="mx-auto max-w-4xl p-0">
          <CardContent className="p-5 text-muted-foreground md:p-10">
            {/* Profile Picture or Team Photo */}
            <div className="mx-auto mb-3 flex size-44 items-center justify-center rounded bg-muted p-3 md:float-left md:mr-5">
              Your Photo
            </div>

            <P>
              Introduce yourself or your team. Share what inspired you to create
              this product and the problem you set out to solve.
            </P>
            <P>
              Explain your mission and values. Help customers understand why
              they should trust you and what makes your approach different.
            </P>
            <P>
              Mention your experience, achievements, or any social proof that
              builds credibility. Keep it authentic and relatable.
            </P>

            {/* Optional: Video Introduction */}
            <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
              Video Introduction (Optional)
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="pricing"
        title="Simple, Transparent Pricing"
        description="Choose the plan that works best for you. No hidden fees."
        background="dark"
      >
        <Pricing>
          <Pricing.Plan
            name="Free"
            price="$0"
            period="/month"
            description="Perfect for getting started"
            features={[
              "Core feature included",
              "Basic support",
              "Limited usage",
              "Community access",
            ]}
            cta={
              <Button className="w-full" variant="outline" size="lg" asChild>
                <Link to="/login">Start Free</Link>
              </Button>
            }
          />

          <Pricing.Plan
            name="Pro"
            price="$29"
            period="/month"
            description="For professionals and growing teams"
            features={[
              "Everything in Free",
              "Advanced features",
              "Priority support",
              "Higher limits",
              "Team collaboration",
              "Analytics dashboard",
            ]}
            highlight="Most Popular"
            cta={
              <CheckoutButton productId="premium" size="lg" className="w-full">
                Get Pro
              </CheckoutButton>
            }
          />

          <Pricing.Plan
            name="Enterprise"
            price="Custom"
            period="pricing"
            description="For large organizations"
            features={[
              "Everything in Pro",
              "Dedicated support",
              "Custom integrations",
              "SLA guarantees",
              "Advanced security",
              "Onboarding assistance",
            ]}
            cta={
              <Button className="w-full" variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            }
          />
        </Pricing>
      </Section>

      <Section id="faq" title="Frequently Asked Questions">
        <Faq
          items={[
            {
              question: "What is [Your Product]?",
              answer:
                "Provide a clear, concise explanation of what your product does and who it's for. Focus on the core value proposition.",
            },
            {
              question: "How do I get started?",
              answer:
                "Explain the onboarding process. Make it sound simple and approachable. Mention any free trial or starter options.",
            },
            {
              question: "What payment methods do you accept?",
              answer:
                "List the payment methods you support. Mention if you offer refunds, trials, or money-back guarantees.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Be transparent about your cancellation policy. Building trust is more important than locking customers in.",
            },
            {
              question: "Do you offer customer support?",
              answer:
                "Describe your support options (email, chat, phone, etc.) and typical response times. Mention any premium support tiers.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Explain your security measures and data protection practices. Mention any certifications or compliance standards.",
            },
          ]}
        />
      </Section>

      <Section title="What Our Customers Say">
        <Testimonials
          items={[
            {
              quote:
                "Add a genuine testimonial from a satisfied customer. Include specific results or benefits they experienced.",
              author: {
                name: "Customer Name",
                id: "customer_handle",
              },
              url: "https://twitter.com/customer_handle",
            },
            {
              quote:
                "Another testimonial highlighting a different aspect of your product. Variety helps appeal to different customer segments.",
              author: {
                name: "Another Customer",
                id: "another_handle",
              },
            },
            {
              quote:
                "Include testimonials that address common objections or concerns potential customers might have.",
              author: {
                name: "Happy User",
                id: "happy_user",
              },
              url: "https://twitter.com/happy_user",
            },
            {
              quote:
                "Testimonials with specific numbers or metrics are particularly compelling. 'Increased our conversion by 40%' etc.",
              author: {
                name: "Business Owner",
                id: "business_owner",
              },
            },
            {
              quote:
                "A testimonial about your customer service or support can build trust and differentiate you from competitors.",
              author: {
                name: "Loyal Customer",
                id: "loyal_customer",
              },
              url: "https://twitter.com/loyal_customer",
            },
            {
              quote:
                "A testimonial focusing on ease of use or quick setup can appeal to busy professionals.",
              author: {
                name: "Power User",
                id: "power_user",
              },
            },
            {
              quote:
                "Include a testimonial from a different industry or use case to show versatility.",
              author: {
                name: "Industry Expert",
                id: "industry_expert",
              },
              url: "https://twitter.com/industry_expert",
            },
            {
              quote:
                "A quote about long-term value or ROI helps justify the purchase decision for hesitant buyers.",
              author: {
                name: "Long-term Customer",
                id: "longterm_customer",
              },
            },
            {
              quote:
                "End with a strong testimonial that reinforces your main value proposition and encourages action.",
              author: {
                name: "Brand Advocate",
                id: "brand_advocate",
              },
              url: "https://twitter.com/brand_advocate",
            },
          ]}
        />
      </Section>
    </>
  )
}
