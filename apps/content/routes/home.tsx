import { CircleCheck, CircleOff } from "lucide-react"
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
      <div className="flex flex-col p-4">
        <div className="flex animate-in flex-col items-center gap-8 blur-in-2xl duration-700">
          <CircleOff className="size-36" />
          <h1 className="font-extrabold text-6xl">PageZERO</h1>
        </div>

        <div className="slide-in-from-bottom-4 fade-in mt-20 max-w-md animate-in rounded-lg bg-muted p-4 text-center duration-1000">
          {greetings.map((greeting) => (
            <p key={greeting.id}>
              <CircleCheck className="mr-2 inline-block size-6 align-top text-green-500" />
              {greeting.greeting}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
