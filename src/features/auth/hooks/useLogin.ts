/**
 * useLogin — POST /auth/login → set tokens → GET /auth/me → resolve family
 * role → store → redirect. A login that resolves to no family role (staff-only
 * account) is out of scope and is sent to /forbidden.
 */
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import type { Role } from "@/types"
import { login as loginApi } from "../api/login"
import { getMe } from "../api/getMe"
import { useAuthStore } from "../store/authStore"
import { buildAuthUser } from "../utils/role"
import type { LoginDto } from "../types"

type LoginResult = { outOfScope: true } | { outOfScope: false; role: Role }

export function useLogin() {
  const navigate = useNavigate()
  const router = useRouter()
  const search = useSearch({ strict: false }) as { redirect?: string }
  const setAuth = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async (dto: LoginDto): Promise<LoginResult> => {
      const { tokens, profile } = await loginApi(dto)

      // Set tokens first so the follow-up /auth/me call is authenticated.
      useAuthStore.getState().setTokens(tokens)

      let fullProfile = profile
      try {
        fullProfile = await getMe()
      } catch {
        // Fall back to the login response profile if /auth/me is unavailable.
      }

      const user = buildAuthUser(fullProfile ?? profile)
      if (!user) {
        useAuthStore.getState().logout()
        return { outOfScope: true }
      }

      setAuth(user, tokens)
      return { outOfScope: false, role: user.role }
    },

    onSuccess: (result) => {
      if (result.outOfScope) {
        navigate({ to: "/forbidden", replace: true })
        return
      }
      // Honor a captured redirect, but never one that loops back to /login.
      const redirect = search.redirect
      if (redirect && !redirect.startsWith("/login") && redirect !== "/") {
        router.history.replace(redirect)
        return
      }
      navigate({ to: result.role === "student" ? "/student" : "/parent", replace: true })
    },
  })
}
