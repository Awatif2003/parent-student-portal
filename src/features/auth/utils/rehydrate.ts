/**
 * ensureUserRehydrated — rebuild the in-memory `user` from GET /auth/me.
 *
 * On a hard refresh the persisted session has tokens but no `user` (we don't
 * persist it). Call this in _app.beforeLoad BEFORE the scope guard reads the
 * user, otherwise a valid session would bounce to /login. Idempotent: it
 * no-ops once `user` is present, and coalesces concurrent calls.
 */
import { getMe } from "../api/getMe"
import { useAuthStore } from "../store/authStore"
import { buildAuthUser } from "./role"

let inflight: Promise<void> | null = null

export async function ensureUserRehydrated(): Promise<void> {
  const state = useAuthStore.getState()
  if (!state.tokens?.accessToken || state.user) return

  if (!inflight) {
    inflight = (async () => {
      try {
        const profile = await getMe()
        const user = buildAuthUser(profile)
        if (user) {
          useAuthStore.getState().setUser(user)
        } else {
          // Out-of-scope (staff-only) account — drop the session.
          useAuthStore.getState().logout()
        }
      } catch {
        // Network/401 — leave state as-is; the guard handles unauthenticated.
      } finally {
        inflight = null
      }
    })()
  }

  return inflight
}
