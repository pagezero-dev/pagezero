import { Minus, Plus } from "lucide-react"
import { Large } from "@/ui/typography"

interface FaqProps {
  items: { question: string; answer: string }[]
}

export const Faq = ({ items }: FaqProps) => {
  return (
    <div className="mx-auto max-w-screen-md">
      <ul>
        {items.map(({ question, answer }) => (
          <li
            key={question}
            className="border-border border-t py-5 last:border-b"
          >
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-1">
                <Large>{question}</Large>
                <div className="text-muted-foreground">
                  <Minus className="hidden size-5 group-open:block" />
                  <Plus className="size-5 group-open:hidden" />
                </div>
              </summary>
              <div className="mt-6 text-muted-foreground">{answer}</div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  )
}
