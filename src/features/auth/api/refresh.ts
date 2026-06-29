/**
 * POST /auth/token/refresh/ → { access, refresh? }
 *
 * Uses a BARE axios call (not apiClient) on purpose: it must not pass through
 * the 401 refresh-and-retry interceptor, or a failing refresh would recurse.
 * It therefore unwraps the { success, data } envelope itself.
 */
import axios from "axios"

import { config } from "@/lib/config"
import { AUTH } from "@/lib/api/endpoints"
import type { AuthTokens } from "../types"

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const res = await axios.post(
    `${config.VITE_API_URL}${AUTH.REFRESH}`,
    { refresh: refreshToken },
    { headers: { "Content-Type": "application/json" }, withCredentials: true },
  )

  const body = res.data
  const payload =
    body && typeof body === "object" && "success" in body
      ? (body as { data?: Record<string, unknown> }).data ?? {}
      : (body as Record<string, unknown>)

  const access = (payload.access ?? payload.accessToken ?? payload.token) as string | undefined
  const refresh = (payload.refresh ?? payload.refreshToken) as string | undefined

  if (!access) {
    throw new Error("Token refresh failed")
  }

  return { accessToken: access, refreshToken: refresh ?? refreshToken }
}
