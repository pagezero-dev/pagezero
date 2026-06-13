import { cn } from "@/ui/utils"

interface PostCoverProps {
  src: string
  alt: string
  className?: string
}

export function PostCover({ src, alt, className }: PostCoverProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "aspect-video w-full rounded-xl border bg-muted object-cover",
        className,
      )}
    />
  )
}

export type { PostCoverProps }
