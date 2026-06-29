/**
 * useLogout — best-effort server logout, then clear local session + caches and
 * return to /login.
 */
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { logoutRequest } from "../api/logout"
import { useAuthStore } from "../store/authStore"

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refresh = useAuthStore.getState().tokens?.refreshToken
      await logoutRequest(refresh)
    },
    onSettled: () => {
      useAuthStore.getState().logout()
      queryClient.clear()
      navigate({ to: "/login", replace: true })
    },
  })
}
