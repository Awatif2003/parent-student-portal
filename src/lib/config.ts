import { z } from "zod"

/**
 * Validated runtime config. The base URL MUST end in /api/v1 — the axios client
 * appends paths like /auth/login/ onto it. We also accept the legacy
 * VITE_API_BASE_URL name so existing .env files keep working.
 */
const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .url()
    .default("http://192.168.100.18:8001/api/v1"),
})

export const config = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL,
})
