import { useQuery } from "@tanstack/react-query"
import { getUser } from "./get-user"

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  })
}
