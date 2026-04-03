import { Check } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@/ui/badge/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card/card"
import { Muted, Small } from "@/ui/typography"
import { cn } from "@/ui/utils"

interface PricingProps {
  children?: ReactNode
}

export const Pricing = ({ children }: PricingProps) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-center gap-10 md:flex-row md:gap-5 lg:gap-10">
        {children}
      </div>
    </div>
  )
}

interface PlanProps {
  name: string
  price: string
  period: string
  description?: string
  features: string[]
  highlight?: string
  cta: ReactNode
}

const PricingPlan = ({
  name,
  price,
  period,
  description,
  features,
  highlight,
  cta,
}: PlanProps) => {
  return (
    <Card
      className={cn("relative basis-1/3", {
        "border-primary shadow-lg md:scale-105": highlight,
      })}
    >
      {highlight && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          {highlight}
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{name}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
        <div className="mt-4">
          <span className="font-bold text-4xl">{price}</span>
          <Muted className="ml-1 inline">{period}</Muted>
        </div>
      </CardHeader>

      <CardContent className="grow">
        <ul className="space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Check className="size-4 text-primary" />
              <Small>{feature}</Small>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>{cta}</CardFooter>
    </Card>
  )
}

PricingPlan.displayName = "Pricing.Plan"
Pricing.Plan = PricingPlan
