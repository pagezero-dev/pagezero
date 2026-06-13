declare module "*.mdx" {
  function MDXComponent(props: Record<string, unknown>): unknown
  export default MDXComponent
}
