---
name: create-component
description: >-
  Creates a new UI component with implementation, index, tests, and Storybook
  stories following PageZERO conventions. Use when adding a UI component or when
  the user asks to scaffold a component in packages/ui or apps.
---

# Create Component

Create a new UI component following the PageZERO component structure pattern.

## Gather Information

Ask the user in a single question:

> What component would you like to create and where should it go?
> - **Purpose**: What should it do/display?
> - **Location**: `packages/ui/` (reusable) or `apps/{feature}/components/` (feature-specific)

## Instructions

After gathering the information, create the full component structure:

1. **Determine the location**:
   - UI components go in `packages/ui/{component-name}/`
   - Feature components go in `apps/{feature}/components/{component-name}/`
   - Ask if unclear

2. **Create 4 files** following the naming convention `{component-name}.tsx`:

### `{component-name}.tsx` - Component Implementation

```tsx
import * as React from "react"

import { cn } from "@/ui/utils"

interface {ComponentName}Props {
  className?: string
  children?: React.ReactNode
}

function {ComponentName}({ className, children }: {ComponentName}Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

export { {ComponentName}, type {ComponentName}Props }
```

### `index.ts` - Public Exports

```ts
export * from "./{component-name}"
```

### `{component-name}.test.tsx` - Unit Tests

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { {ComponentName} } from "./{component-name}"

describe("<{ComponentName} />", () => {
  it("renders", () => {
    render(<{ComponentName}>Test content</{ComponentName}>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })
})
```

### `{component-name}.stories.tsx` - Storybook Stories

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"

import { {ComponentName} } from "./{component-name}"

const meta = {
  title: "{StoryTitle}/{ComponentName}",
  component: {ComponentName},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof {ComponentName}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "{ComponentName}",
  },
}
```

## Naming Conventions

- **File names**: Use kebab-case (e.g., `checkout-button.tsx`)
- **Component names**: Use PascalCase (e.g., `CheckoutButton`)
- **Story titles**:
  - UI components: `"Packages/UI/{ComponentName}"`
  - Feature components: `"Apps/{FeatureName}/{ComponentName}"`

## Variants (if needed)

For components with variants, use `cva` (class-variance-authority):

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const {componentName}Variants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      secondary: "secondary-classes",
    },
    size: {
      default: "size-default",
      sm: "size-sm",
      lg: "size-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type {ComponentName}Props = React.ComponentProps<"div"> &
  VariantProps<typeof {componentName}Variants>
```

## After Creation

1. Run `bun run check:fix` to format the new files (use `required_permissions: ["all"]` to run outside sandbox)
2. Run `bun run test` to verify tests pass
3. Provide user link to relevant Storybook story
