import type { ReactNode } from "react"
import { Large } from "@/ui/typography"

interface FeaturesProps {
  children?: ReactNode
}

export const Features = ({ children }: FeaturesProps) => {
  return (
    <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 xl:gap-20">
      {children}
    </div>
  )
}

interface FeatureItemProps {
  title: string
  icon: ReactNode
  cta?: ReactNode
  children: ReactNode
}

const FeaturesItem = ({ title, icon, cta, children }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <div className="size-6 shrink-0 text-primary">{icon}</div>
        <Large className="text-pretty">{title}</Large>
      </div>
      <div className="grow text-muted-foreground">{children}</div>
      {cta}
    </div>
  )
}

FeaturesItem.displayName = "Features.Item"
Features.Item = FeaturesItem
