/**
 * POST /auth/login/ → { access, refresh, user, tenant? }
 *
 * The apiClient unwraps the { success, data } envelope, so `data` here is the
 * inner payload. We send both `email` and `username` set to the same identifier
 * because some family accounts sign in with a username rather than an email.
 */
import { apiClient } from "@/lib/api/client"
import { AUTH } from "@/lib/api/endpoints"
import type { AuthTokens, LoginDto, LoginResponse, UserProfile } from "../types"

export async function login(
  dto: LoginDto,
): Promise<{ tokens: AuthTokens; profile: UserProfile | null }> {
  const { data } = await apiClient.post<LoginResponse>(AUTH.LOGIN, {
    email: dto.identifier,
    username: dto.identifier,
    password: dto.password,
  })

  const access = data.access ?? data.accessToken ?? data.token
  const refresh = data.refresh ?? data.refreshToken ?? ""

  if (!access) {
    throw new Error("Login response did not include an access token.")
  }

  return {
    tokens: { accessToken: access, refreshToken: refresh },
    profile: data.user ?? null,
  }
}
