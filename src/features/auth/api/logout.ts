/**
 * POST /auth/logout/ — best-effort server-side token blacklist. We clear the
 * local session regardless of the outcome, so failures here are swallowed.
 */
import { apiClient } from "@/lib/api/client"
import { AUTH } from "@/lib/api/endpoints"

export async function logoutRequest(refreshToken: string | undefined): Promise<void> {
  try {
    await apiClient.post(AUTH.LOGOUT, { refresh: refreshToken })
  } catch {
    // Ignore — the local session is cleared by the caller either way.
  }
}
