import type { Role } from "@/types"

/**
 * Role codenames that belong to the family portal. A login that resolves to one
 * of these is in scope; anything else (staff-only accounts) is out of scope.
 */
export const FAMILY_ROLES = ["parent", "guardian", "student"] as const

/** Post-login landing path per role. */
export const ROLE_HOME: Record<Role, string> = {
  parent: "/parent",
  guardian: "/parent",
  student: "/student",
}

/** Human label shown in the shell (eyebrow / portal name). */
export const ROLE_LABELS: Record<Role, string> = {
  parent: "Parent Portal",
  guardian: "Parent Portal",
  student: "Student Portal",
}

export function isFamilyRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    (FAMILY_ROLES as readonly string[]).includes(value.toLowerCase())
  )
}

/** Parents and guardians share the same portal surface. */
export function isParentRole(role: string | null | undefined): boolean {
  return ["parent", "guardian"].includes(String(role ?? "").toLowerCase())
}
