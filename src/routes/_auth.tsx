import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { getAuthState } from "@/features/auth/store/authStore"
import { ensureUserRehydrated } from "@/features/auth/utils/rehydrate"

export const Route = createFileRoute("/_auth")({
  // Already signed in? Skip the auth screens and go to the role's home.
  beforeLoad: async () => {
    await ensureUserRehydrated()
    const { isAuthenticated, user } = getAuthState()
    if (isAuthenticated && user) {
      throw redirect({ to: user.role === "student" ? "/student" : "/parent" })
    }
  },
  component: () => <Outlet />,
})
