/**
 * Centralized API client with normalized errors and auth interceptors.
 *
 * - Request interceptor: attaches the Bearer token at call time (reads the
 *   Zustand store via getAuthState() — no module-init import, no circular dep)
 *   and stamps `X-Portal: family` so the backend resolves the user's
 *   parent/student role even when they ALSO hold a staff role.
 * - Response interceptor: unwraps the `{ success, data }` envelope on the
 *   fulfilled path, and does a coalesced refresh-and-retry on 401 (with token
 *   rotation) on the rejected path.
 * - Normalized ApiError: every catch site speaks one language; branch on `e.code`.
 */
import axios from "axios"

import { config } from "@/lib/config"
import type { AuthTokens } from "@/features/auth/types"
import { getAuthState } from "@/features/auth/store/authStore"
import { refreshTokens } from "@/features/auth/api/refresh"

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    /** DRF field validation errors from a 400 response, keyed by field name. */
    public fieldErrors?: Record<string, string[]>,
    /** Raw `error.details` body (or flat body) from a 400 response. */
    public details?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError
}

/**
 * Normalize the ShuleYangu error body into { code, message }.
 *
 * The backend wraps errors in an envelope:
 *   { error: { code, message, details: { detail } | { field: [msg] } } }
 * `details.detail` carries the clean human message for auth/permission errors;
 * field-validation errors put per-field arrays in `details`. We fall back to
 * the flat DRF shape and finally to axios's generic message.
 */
function parseErrorBody(
  data: unknown,
  fallbackMessage: string,
): { code: string; message: string } {
  const body = (data ?? {}) as Record<string, unknown>
  const envelope = (body.error ?? body) as Record<string, unknown>

  const code = typeof envelope.code === "string" ? envelope.code : "UNKNOWN"

  const details = envelope.details as Record<string, unknown> | undefined
  let message: string | undefined

  if (details && typeof details.detail === "string") {
    message = details.detail
  } else if (typeof envelope.message === "string" && !envelope.message.startsWith("{")) {
    message = envelope.message
  } else if (typeof envelope.detail === "string") {
    message = envelope.detail
  } else if (details) {
    const first = Object.values(details).find(
      (v): v is string[] => Array.isArray(v) && typeof v[0] === "string",
    )
    message = first?.[0]
  }

  return { code, message: message ?? fallbackMessage }
}

export const apiClient = axios.create({
  baseURL: config.VITE_API_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// ── Request interceptor: attach token at call time + family portal scope ──
apiClient.interceptors.request.use((cfg) => {
  const tokens = getAuthState().tokens
  if (tokens?.accessToken) {
    cfg.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  // Declare this as the family (parent/student) portal so the backend scopes
  // the user to their own children/record even if they also hold staff roles.
  if (!cfg.headers["X-Portal"]) {
    cfg.headers["X-Portal"] = "family"
  }
  return cfg
})

// ── Response interceptor: unwrap envelope + coalesced refresh-and-retry on 401 ─
let refreshPromise: Promise<void> | null = null

apiClient.interceptors.response.use(
  (res) => {
    // The backend wraps every 2xx in { success: true, data: <payload> }.
    const body = res.data
    if (body && typeof body === "object" && "success" in body) {
      const env = body as { success: boolean; data?: unknown }
      if (env.success) {
        res.data = env.data
        return res
      }
      const { code, message } = parseErrorBody(body, "Request failed")
      return Promise.reject(new ApiError(res.status, code, message))
    }
    return res
  },
  async (error) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      original &&
      !original._retry
    ) {
      original._retry = true

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const tokens = getAuthState().tokens
          if (!tokens?.refreshToken) {
            const { useAuthStore } = await import("@/features/auth/store/authStore")
            useAuthStore.getState().logout()
            throw new Error("no refresh token")
          }
          try {
            const newTokens: AuthTokens = await refreshTokens(tokens.refreshToken)
            const { useAuthStore } = await import("@/features/auth/store/authStore")
            useAuthStore.getState().setTokens(newTokens)
          } catch {
            const { useAuthStore } = await import("@/features/auth/store/authStore")
            useAuthStore.getState().logout()
            throw new Error("refresh failed")
          }
        })().finally(() => {
          refreshPromise = null
        })
      }

      try {
        await refreshPromise
        const freshTokens = getAuthState().tokens
        if (freshTokens?.accessToken) {
          original.headers.Authorization = `Bearer ${freshTokens.accessToken}`
        }
        return apiClient(original)
      } catch {
        return Promise.reject(error)
      }
    }

    // Normalize non-401 errors.
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response
      const { code, message } = parseErrorBody(data, error.message)

      let fieldErrors: Record<string, string[]> | undefined
      let details: unknown
      if (status === 400 && data && typeof data === "object") {
        const raw = data as Record<string, unknown>
        const source =
          ((raw.error as Record<string, unknown> | undefined)?.details as
            | Record<string, unknown>
            | undefined) ?? raw
        details = source
        const extracted = Object.fromEntries(
          Object.entries(source)
            .filter(([, v]) => Array.isArray(v))
            .map(([k, v]) => [k, (v as unknown[]).map(String)]),
        )
        if (Object.keys(extracted).length > 0) fieldErrors = extracted
      }

      throw new ApiError(status, code, message, fieldErrors, details)
    }

    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new ApiError(0, "TIMEOUT", "Request timed out")
    }

    throw new ApiError(0, "NETWORK", "Network error — check your connection")
  },
)

/** Download a binary response (e.g. a report-card PDF) and trigger a save. */
export async function apiDownload(
  url: string,
  filename: string,
  opts: { method?: "GET" | "POST"; data?: unknown } = {},
): Promise<Blob> {
  const { data } = await apiClient.request<Blob>({
    url,
    method: opts.method ?? "GET",
    data: opts.data,
    responseType: "blob",
  })

  const downloadUrl = window.URL.createObjectURL(data)
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(downloadUrl)

  return data
}
