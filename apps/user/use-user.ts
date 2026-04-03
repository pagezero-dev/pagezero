import useSWR from "swr"
import type { UserData } from "@/user/routes/user"

export function useUser() {
  const fetcher = (url: string) =>
    fetch(url).then((res) => res.json() as Promise<UserData>)

  return useSWR<UserData>("/user", fetcher)
}
