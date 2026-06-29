import { createFileRoute } from "@tanstack/react-router"

import { LoginForm } from "@/features/auth/components/LoginForm"

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const r = typeof search.redirect === "string" ? search.redirect : undefined
    // Drop redirects pointing back at /login so the param can't loop.
    return { redirect: r && !r.startsWith("/login") ? r : undefined }
  },
  component: LoginForm,
})
