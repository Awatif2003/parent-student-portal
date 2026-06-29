/**
 * App-wide shared types.
 *
 * This is the FAMILY portal — the only roles that ever sign in here are
 * parents/guardians and students. Staff roles are handled by the separate
 * in-school workspace; a staff-only account is treated as out-of-scope.
 */
export type Role = "parent" | "guardian" | "student"

/** A loose record for normalizing dynamic API payloads at the service boundary. */
export type Dict = Record<string, any>
