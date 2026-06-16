import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"
import { Heading, Lead } from "@/ui/typography"
import { cn } from "@/ui/utils"

const sectionVariants = cva("", {
  variants: {
    spacingSize: {
      default: "py-32",
      sm: "py-16",
      lg: "py-40",
      none: "py-0",
    },
    background: {
      none: "",
      light: "bg-muted/30",
      medium: "bg-muted/50",
      dark: "bg-muted",
    },
  },
  defaultVariants: {
    spacingSize: "default",
    background: "none",
  },
})

type SectionProps = {
  children?: ReactNode
  id?: string
  title?: string
  description?: string
  badge?: ReactNode
} & VariantProps<typeof sectionVariants>

export const Section = ({
  children,
  title,
  description,
  badge,
  id,
  spacingSize,
  background,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(sectionVariants({ spacingSize, background }))}
    >
      <div className="container mx-auto px-5">
        {badge && (
          <div className="mx-auto mb-4 flex justify-center">{badge}</div>
        )}
        {(title || description) && (
          <div className="mx-auto mb-20 max-w-2xl text-center">
            {title && (
              <Heading level={2} className="mb-4 text-4xl">
                {title}
              </Heading>
            )}
            {description && <Lead>{description}</Lead>}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
