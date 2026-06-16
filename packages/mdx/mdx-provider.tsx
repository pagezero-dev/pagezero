import { MDXProvider as MdxJsProvider } from "@mdx-js/react"
import type { ReactNode } from "react"
import { mdxComponents } from "./mdx-components"

interface MDXProviderProps {
  children: ReactNode
}

export function MDXProvider({ children }: MDXProviderProps) {
  return <MdxJsProvider components={mdxComponents}>{children}</MdxJsProvider>
}
