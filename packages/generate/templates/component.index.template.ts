export const componentIndexTemplate = ({
  name,
  fileName,
}: {
  name: string
  fileName: string
}) => `

export { ${name} } from "./${fileName.toLowerCase()}"
`
