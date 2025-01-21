export const componentTemplate = ({ name }: { name: string }) => `

import { clsx } from "clsx"

interface ${name}Props {
}

export const ${name} = ({}: ${name}Props) => {
  return (
    <div className={clsx()}>Test text</div>
  )
}
`
