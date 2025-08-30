import { mkdirSync, writeFileSync } from "node:fs"
import { Command } from "commander"
import { componentIndexTemplate } from "./templates/component.index.template"
import { componentStoryTemplate } from "./templates/component.story.template"
import { componentTemplate } from "./templates/component.template"
import { componentTestTemplate } from "./templates/component.test.template"

const program = new Command()

program.name("generate").description("Code generator")

function toKebabCase(value: string) {
  return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase()
}

program
  .command("component")
  .description("Generate a React component with tests and Storybook file")
  .argument("<name>", "Component name")
  .argument("<dir>", "Parent directory path")
  .action((name, dir) => {
    console.log(`🛠️ Generating React component "${name}" at ${dir}...`)
    const fileName = toKebabCase(name)
    const componentDirPath = `${dir}/${fileName}`
    const componentIndexPath = `${dir}/${fileName}/index.ts`
    const componentPath = `${dir}/${fileName}/${fileName}.tsx`
    const componentTestPath = `${dir}/${fileName}/${fileName}.test.tsx`
    const componentStoryPath = `${dir}/${fileName}/${fileName}.stories.tsx`
    mkdirSync(componentDirPath)
    console.log("📂", componentDirPath)
    writeFileSync(
      componentIndexPath,
      componentIndexTemplate({ name, fileName }),
    )
    console.log("✅", componentIndexPath)
    writeFileSync(componentPath, componentTemplate({ name }))
    console.log("✅", componentPath)
    writeFileSync(componentTestPath, componentTestTemplate({ name, fileName }))
    console.log("✅", componentTestPath)
    writeFileSync(
      componentStoryPath,
      componentStoryTemplate({ name, fileName }),
    )
    console.log("✅", componentStoryPath)
    console.log("✨ All done! ✨")
  })

try {
  program.parse()
} catch (error) {
  console.error("\n❌ ERROR! ❌")
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(error)
  }
}
