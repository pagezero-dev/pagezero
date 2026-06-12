import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { logout as logoutAction } from "@/auth/logout"

export function useLogout() {
  const queryClient = useQueryClient()
  const logoutFn = useServerFn(logoutAction)

  return async function logout() {
    await logoutFn()
    void queryClient.invalidateQueries({ queryKey: ["user"] })
  }
}
