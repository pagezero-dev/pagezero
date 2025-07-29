export const componentTemplate = ({ name }: { name: string }) => `

import { cn } from "@/ui/utils"

interface ${name}Props {
}

export const ${name} = ({}: ${name}Props) => {
  return (
    <div className={cn()}>Test text</div>
  )
}
`
