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
      <div className="flex flex-col justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-8 animate-in blur-in-2xl duration-700">
          <CircleOff className="size-36" />
          <h1 className="text-6xl font-extrabold ">PageZERO</h1>
        </div>

        <div className="text-center bg-gray-100 rounded-lg p-4 max-w-md mt-20 animate-in slide-in-from-bottom-4 fade-in duration-1000">
          {greetings.map((greeting) => (
            <p key={greeting.id}>
              <CircleCheck className="size-6 text-green-500 align-top inline-block mr-2" />
              {greeting.greeting}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
