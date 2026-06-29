/**
 * GET /auth/me/ → the authenticated user's profile (with role_assignments[]).
 *
 * The apiClient strips the { success, data } envelope. Some deployments nest
 * the profile one level deeper under `data`, so we unwrap that too.
 */
import { apiClient } from "@/lib/api/client"
import { AUTH } from "@/lib/api/endpoints"
import type { UserProfile } from "../types"

export async function getMe(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(AUTH.ME)
  const nested = (data as { data?: unknown }).data
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as UserProfile
  }
  return data
}
