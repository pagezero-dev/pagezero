import { greetings } from "db/schema"
import { Route } from "./+types/home"

export const loader = async ({ context: { db } }: Route.LoaderArgs) => {
  const results = await db.select().from(greetings).all()
  return { greetings: results }
}

export default function Home({
  loaderData: { greetings },
}: Route.ComponentProps) {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 bg-slate-100 px-10 py-8 shadow-sm">
        <h1 className="text-4xl font-bold">PageZERO</h1>
        {greetings.map((greeting) => (
          <p key={greeting.id}>{greeting.greeting}</p>
        ))}
      </div>
    </main>
  )
}
