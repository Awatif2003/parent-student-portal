import { Navigate, Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

import { AppLayout } from "@/components/layout/AppLayout"
import { homeForRole, portalForPath } from "@/components/layout/nav"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/features/auth/store/authStore"
import { requireAuth } from "@/features/auth/utils/guards"
import { ensureUserRehydrated } from "@/features/auth/utils/rehydrate"

export const Route = createFileRoute("/_app")({
  // On a hard refresh the persisted session has tokens but no `user`, so
  // rehydrate (GET /auth/me) BEFORE requireAuth reads it — otherwise a valid
  // session would bounce to /login. ensureUserRehydrated is idempotent.
  beforeLoad: async ({ location }) => {
    await ensureUserRehydrated()
    requireAuth(location.pathname)
  },
  pendingComponent: BootSplash,
  component: AppRoute,
})

function BootSplash() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Spinner className="text-muted-foreground size-6" />
    </div>
  )
}

function AppRoute() {
  const user = useAuthStore((s) => s.user)
  const { pathname } = useLocation()

  if (!user) {
    return <Navigate to="/login" />
  }

  // Keep each portal to its own role: a parent landing on /student/* (or vice
  // versa) is redirected to their own home.
  const userPortal = user.role === "student" ? "student" : "parent"
  if (portalForPath(pathname) !== userPortal) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return (
    <AppLayout role={user.role}>
      <Outlet />
    </AppLayout>
  )
}
