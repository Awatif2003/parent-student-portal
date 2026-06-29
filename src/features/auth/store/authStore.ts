/**
 * Zustand auth store — the single source of truth for auth state.
 *
 * Why Zustand (not Context): non-React code (the axios interceptors) reads
 * state via getAuthState() without subscriptions or re-renders. Persisted to
 * localStorage so sessions survive reloads.
 *
 * Only tokens + the auth flag are persisted. `user` is intentionally NOT
 * persisted; it's rebuilt from GET /auth/me on boot by ensureUserRehydrated
 * (utils/rehydrate.ts), so a token refresh or role change is always honored.
 */
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { AuthState, AuthTokens, AuthUser } from "../types"

interface AuthStore extends AuthState {
  login: (user: AuthUser, tokens: AuthTokens) => void
  logout: () => void
  setTokens: (tokens: AuthTokens) => void
  setUser: (user: AuthUser) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      tokens: null,

      login: (user, tokens) => set({ isAuthenticated: true, user, tokens }),
      logout: () => set({ isAuthenticated: false, user: null, tokens: null }),
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "shuleyangu-family-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens,
      }),
    },
  ),
)

/**
 * getAuthState — for non-React contexts (axios interceptors, utilities).
 * Always call this so you get a fresh read at call time.
 */
export const getAuthState = (): AuthState => useAuthStore.getState()
