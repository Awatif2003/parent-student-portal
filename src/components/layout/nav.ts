/**
 * Sidebar navigation config, keyed by portal. The student and parent/guardian
 * surfaces share the shell but differ in their item sets.
 */
import type { Role } from "@/types"

export type NavIcon =
  | "home"
  | "users"
  | "calendarCheck"
  | "clipboardCheck"
  | "fileText"
  | "idCard"
  | "receipt"
  | "banknote"
  | "bell"
  | "graduationCap"

/**
 * Every navigable leaf path. Typed as a union (not `string`) so it's assignable
 * to TanStack Router's typed `Link to=` — keeps nav links type-checked against
 * the real route tree. Add a path here when you add its route file.
 */
export type AppPath =
  | "/parent"
  | "/parent/children"
  | "/parent/attendance"
  | "/parent/results/continuous-assessments"
  | "/parent/results/term-results"
  | "/parent/results/student-result-card"
  | "/parent/finance/invoice"
  | "/parent/finance/receipts"
  | "/parent/notifications"
  | "/student"
  | "/student/details"
  | "/student/attendance"
  | "/student/results/continuous-assessment"
  | "/student/results/term-results"
  | "/student/results"
  | "/student/notifications"

export interface NavLeaf {
  label: string
  to: AppPath
  icon: NavIcon
}

export interface NavGroup {
  label: string
  icon: NavIcon
  children: NavLeaf[]
}

export type NavItem = NavLeaf | NavGroup

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item
}

const parentNav: NavItem[] = [
  { label: "Overview", to: "/parent", icon: "home" },
  { label: "My Children", to: "/parent/children", icon: "users" },
  { label: "Attendance", to: "/parent/attendance", icon: "calendarCheck" },
  {
    label: "Results",
    icon: "graduationCap",
    children: [
      { label: "Continuous Assessment", to: "/parent/results/continuous-assessments", icon: "clipboardCheck" },
      { label: "Annual Results", to: "/parent/results/term-results", icon: "fileText" },
      { label: "Result Card", to: "/parent/results/student-result-card", icon: "idCard" },
    ],
  },
  {
    label: "Finance",
    icon: "banknote",
    children: [
      { label: "Invoices", to: "/parent/finance/invoice", icon: "fileText" },
      { label: "Receipts", to: "/parent/finance/receipts", icon: "receipt" },
    ],
  },
  { label: "Notifications", to: "/parent/notifications", icon: "bell" },
]

const studentNav: NavItem[] = [
  { label: "Overview", to: "/student", icon: "home" },
  { label: "My Details", to: "/student/details", icon: "idCard" },
  { label: "Attendance", to: "/student/attendance", icon: "calendarCheck" },
  {
    label: "Results",
    icon: "graduationCap",
    children: [
      { label: "Continuous Assessment", to: "/student/results/continuous-assessment", icon: "clipboardCheck" },
      { label: "Term Results", to: "/student/results/term-results", icon: "fileText" },
      { label: "My Results", to: "/student/results", icon: "idCard" },
    ],
  },
  { label: "Notifications", to: "/student/notifications", icon: "bell" },
]

export function getNavForRole(role: Role): NavItem[] {
  return role === "student" ? studentNav : parentNav
}

/** Which portal a path belongs to — used by the shell's portal guard. */
export function portalForPath(pathname: string): "parent" | "student" {
  return pathname.startsWith("/student") ? "student" : "parent"
}

/** The home path for a role's portal. */
export function homeForRole(role: Role): "/parent" | "/student" {
  return role === "student" ? "/student" : "/parent"
}
