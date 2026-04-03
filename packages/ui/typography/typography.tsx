/* eslint-disable jsx-a11y/heading-has-content */
import * as React from "react"
import { cn } from "@/ui/utils"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel
}

function Heading({ level, className, ...props }: HeadingProps) {
  const styles = cn(
    "mt-6 mb-2 scroll-m-20 tracking-tight",
    {
      "text-balance font-extrabold text-4xl": level === 1,
      "font-semibold text-3xl": level === 2,
      "font-semibold text-2xl": level === 3,
      "font-semibold text-xl": level === 4,
      "font-semibold text-lg": level === 5,
      "font-semibold text-base": level === 6,
    },
    className,
  )

  switch (level) {
    case 1:
      return <h1 className={styles} {...props} />
    case 2:
      return <h2 className={styles} {...props} />
    case 3:
      return <h3 className={styles} {...props} />
    case 4:
      return <h4 className={styles} {...props} />
    case 5:
      return <h5 className={styles} {...props} />
    case 6:
      return <h6 className={styles} {...props} />
    default:
      return <h2 className={styles} {...props} />
  }
}

function P({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("mb-6 leading-7", className)} {...props} />
}

function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("my-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  )
}

function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-1 py-0.5 font-mono font-semibold text-sm",
        className,
      )}
      {...props}
    />
  )
}

function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("my-4 text-muted-foreground text-xl", className)}
      {...props}
    />
  )
}

function Large({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-semibold text-lg", className)} {...props} />
}

function Small({ className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      className={cn("font-medium text-sm leading-none", className)}
      {...props}
    />
  )
}

function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn(className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn(className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  )
}

export {
  Heading,
  P,
  Blockquote,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted,
  List,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
}
