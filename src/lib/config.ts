import { z } from "zod"

/**
 * Resolves the backend API base URL at runtime — no hardcoded dev IP required.
 * The base URL MUST end in /api/v1 — the axios client appends paths like
 * /auth/login/ onto it.
 *
 * Priority:
 *  1. An explicit VITE_API_URL (or legacy VITE_API_BASE_URL) still wins, so
 *     teammates' existing .env files and CI/prod overrides keep working.
 *  2. Production builds fall back to the deployed API.
 *  3. In development we derive the host from window.location.hostname, so the
 *     dev server works over the LAN (e.g. testing on a phone at 192.168.x.x)
 *     without anyone editing an IP. Always port 8001 with the /api/v1 suffix.
 */
function resolveApiUrl(): string {
  const explicit =
    import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL
  if (explicit) return explicit
  if (import.meta.env.PROD) return "https://api.shuleyangu.com/api/v1"
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost"
  return `http://${host}:8001/api/v1`
}

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
})

export const config = envSchema.parse({
  VITE_API_URL: resolveApiUrl(),
})
