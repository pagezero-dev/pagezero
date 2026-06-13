import { useQuery } from "@tanstack/react-query"
import { getUser } from "../rpc/get-user"

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  })
}
