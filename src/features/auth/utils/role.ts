/**
 * Family-role resolution.
 *
 * This is the FAMILY portal, so we always resolve the user's parent/guardian/
 * student assignment — even when they ALSO hold a staff role (e.g. a Class
 * Teacher who is also a Parent). Otherwise a staff assignment flagged
 * `is_primary` would win and the parent role would look "deactivated" here.
 *
 * Ported from the original authStorage.js — this scoping logic predates the
 * migration and is load-bearing for dual-role accounts.
 */
import type { Role } from "@/types"
import type { AuthUser, RoleAssignment, UserProfile } from "../types"

const FAMILY_ROLE_CODENAMES = ["parent", "guardian", "student"]

function isFamilyAssignment(assignment: RoleAssignment): boolean {
  return FAMILY_ROLE_CODENAMES.includes(
    String(assignment?.role_codename ?? "").toLowerCase(),
  )
}

export function getPrimaryRoleAssignment(
  user: UserProfile | null | undefined,
): RoleAssignment | null {
  const assignments = user?.role_assignments
  if (!Array.isArray(assignments)) return null

  return (
    assignments.find((a) => a.is_active && isFamilyAssignment(a)) ??
    assignments.find((a) => a.is_primary && a.is_active) ??
    assignments.find((a) => a.is_active) ??
    assignments[0] ??
    null
  )
}

/** Resolve the family Role, or null if the account is out of scope (staff-only). */
export function resolveRole(user: UserProfile | null | undefined): Role | null {
  const primary = getPrimaryRoleAssignment(user)
  const tenant = (user?.tenant ?? {}) as Record<string, unknown>
  const raw = String(
    primary?.role_codename ||
      primary?.role_name ||
      tenant.role ||
      user?.role_codename ||
      user?.role_name ||
      (typeof user?.role === "string" ? user.role : "") ||
      "",
  ).toLowerCase()

  if (raw.includes("guardian")) return "guardian"
  if (raw.includes("parent")) return "parent"
  if (raw.includes("student")) return "student"
  return null
}

function resolveName(user: UserProfile): string {
  return (
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    user.email ||
    "Member"
  )
}

/** Map a raw profile into the UI's AuthUser, or null when out of scope. */
export function buildAuthUser(user: UserProfile | null | undefined): AuthUser | null {
  if (!user) return null
  const role = resolveRole(user)
  if (!role) return null
  const primary = getPrimaryRoleAssignment(user)

  return {
    id: String(user.id),
    email: String(user.email ?? user.username ?? ""),
    name: resolveName(user),
    role,
    schoolId: primary?.school,
    schoolName: primary?.school_name,
    organizationId: primary?.organization,
    profile: user,
  }
}
