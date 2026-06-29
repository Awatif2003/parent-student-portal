import { createFileRoute, redirect } from "@tanstack/react-router"

import { getAuthState } from "@/features/auth/store/authStore"
import { ensureUserRehydrated } from "@/features/auth/utils/rehydrate"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await ensureUserRehydrated()
    const { isAuthenticated, user } = getAuthState()
    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" })
    }
    throw redirect({ to: user.role === "student" ? "/student" : "/parent" })
  },
})
