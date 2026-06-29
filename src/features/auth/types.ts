/**
 * Auth types for the family portal.
 *
 * The backend is multi-tenant: a user can hold roles at different schools.
 * `role_assignments[]` is the source of truth for scope. This portal always
 * prefers the user's parent/guardian/student assignment (see utils/role.ts).
 */
import type { Role, Dict } from "@/types"

// ── Tokens (SimpleJWT) ──────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt?: number
}

// ── Role assignment (from /auth/me → role_assignments[]) ─────────────────
export interface RoleAssignment {
  role_codename?: string
  role_name?: string
  role?: string
  organization?: string
  organization_name?: string
  school?: string
  school_name?: string
  is_primary?: boolean
  is_active?: boolean
  permissions?: string[]
}

// ── Raw profile (from POST /auth/login user + GET /auth/me) ──────────────
export interface UserProfile {
  id: number | string
  email?: string
  username?: string
  full_name?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  role_assignments?: RoleAssignment[]
  /** Tolerate the backend's many extra fields without losing type-safety elsewhere. */
  [key: string]: unknown
}

// ── Mapped user (what the UI consumes) ───────────────────────────────────
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  schoolId?: string
  schoolName?: string
  organizationId?: string
  /** The raw profile, kept so identity helpers can resolve student/guardian ids. */
  profile: UserProfile
}

// ── Store state ──────────────────────────────────────────────────────────
export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  tokens: AuthTokens | null
}

// ── Login ─────────────────────────────────────────────────────────────────
export interface LoginDto {
  /** Email OR username — some family accounts sign in with a username. */
  identifier: string
  password: string
}

export interface LoginResponse extends Dict {
  access?: string
  accessToken?: string
  token?: string
  refresh?: string
  refreshToken?: string
  user?: UserProfile
}
