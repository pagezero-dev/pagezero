import { type ReactNode } from "react"
import { Heading } from "@/ui/typography"

interface HeroProps {
  title: string
  description: string
  cta: ReactNode
  children?: ReactNode
}

export const Hero = ({ title, description, cta, children }: HeroProps) => {
  return (
    <section className="relative flex min-h-screen xl:min-h-[905px]">
      {children}
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 py-20 md:gap-10">
        <Heading level={1} className="my-0 text-center text-5xl md:text-6xl">
          {title}
        </Heading>
        <p className="text-center text-muted-foreground text-xl leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-4">{cta}</div>
      </div>
    </section>
  )
}
