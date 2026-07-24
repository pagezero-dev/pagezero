import { User } from "lucide-react"

import { Muted } from "@/ui/typography"

type TestimonialAuthor = {
  name: string
  imageSrc?: string
  id?: string
}

interface TestimonialProps {
  quote: string
  author: TestimonialAuthor
}

interface TestimonialWithUrlProps extends TestimonialProps {
  url?: string
}

interface TestimonialsProps {
  items: TestimonialWithUrlProps[]
}

const Testimonial = ({ quote, author }: TestimonialProps) => {
  return (
    <figure className="bg-card text-card-foreground break-inside-avoid rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <blockquote className="leading-relaxed">"{quote}"</blockquote>
      <figcaption className="mt-6 flex gap-4">
        {author.imageSrc ? (
          <img
            src={author.imageSrc}
            alt=""
            className="border-border size-10 rounded-full border object-cover"
          />
        ) : (
          <div className="border-border bg-muted flex size-10 items-center justify-center rounded-full border">
            <User className="text-muted-foreground size-5" />
          </div>
        )}

        <div className="space-y-1">
          <div className="text-sm font-medium">{author.name}</div>
          {author.id && <Muted className="text-xs">@{author.id}</Muted>}
        </div>
      </figcaption>
    </figure>
  )
}

export const Testimonials = ({ items }: TestimonialsProps) => {
  return (
    <div className="gap-8 space-y-8 sm:columns-2 lg:columns-3">
      {items.map(({ quote, url, author }) =>
        url ? (
          <a
            href={url}
            key={quote}
            className="focus-visible:ring-ring block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Testimonial quote={quote} author={author} />
          </a>
        ) : (
          <Testimonial key={quote} quote={quote} author={author} />
        ),
      )}
    </div>
  )
}
