import { redirect } from "@tanstack/react-router"

import { getAuthState } from "../store/authStore"

/**
 * Coarse route guard for the authenticated shell. Throws a redirect to /login
 * (capturing the attempted path) when there's no active session. Call this in
 * a route's `beforeLoad`, AFTER ensureUserRehydrated.
 */
export function requireAuth(pathname: string): void {
  const { isAuthenticated, tokens } = getAuthState()
  if (!isAuthenticated || !tokens?.accessToken) {
    throw redirect({
      to: "/login",
      search:
        pathname && !pathname.startsWith("/login")
          ? { redirect: pathname }
          : undefined,
    })
  }
}
