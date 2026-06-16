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
    <figure className="break-inside-avoid rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md">
      <blockquote className="leading-relaxed">"{quote}"</blockquote>
      <figcaption className="mt-6 flex gap-4">
        {author.imageSrc ? (
          <img
            src={author.imageSrc}
            alt=""
            className="size-10 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-1">
          <div className="font-medium text-sm">{author.name}</div>
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
            className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
