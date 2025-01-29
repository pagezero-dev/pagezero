import { useLoaderData, LoaderFunctionArgs } from "react-router"
import { greetings } from "../db/schema"

export const loader = async ({ context: { db } }: LoaderFunctionArgs) => {
  const results = await db.select().from(greetings).all()
  return { greetings: results }
}

export default function Home() {
  const { greetings } = useLoaderData<typeof loader>()
  return (
    <main>
      <h1>Hello world!</h1>
      {greetings.map((greeting) => (
        <p key={greeting.id}>{greeting.greeting}</p>
      ))}
    </main>
  )
}
