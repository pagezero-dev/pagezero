import { greetings } from "@/db/schema"
import type { Route } from "@/types/route"

export const loader = async ({ context: { db } }: Route.LoaderArgs) => {
  const results = await db.select().from(greetings).all()
  return { greetings: results }
}

export default function Home({
  loaderData: { greetings },
}: Route.ComponentProps<typeof loader>) {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl font-extrabold animate-in blur-in-2xl duration-1000">
          PageZERO
        </h1>
        <h2 className="text-lg animate-in slide-in-from-bottom fade-in duration-1000 text-gray-600 tracking-wide">
          Full-stack web application starter for Cloudflare
        </h2>
        {greetings.map((greeting) => (
          <p key={greeting.id}>{greeting.greeting}</p>
        ))}
      </div>
    </main>
  )
}
