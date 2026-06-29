import { apiClient } from "@/lib/api/client"
import { ATTENDANCE } from "@/lib/api/endpoints"
import { normalizeCollection } from "@/lib/identity"
import type { Dict } from "@/types"
import type { AttendanceRecord, ChildAttendance } from "./types"

export type AttendanceParams = Record<string, string | number>

/**
 * Parent self-service: the authenticated guardian's linked children
 * (cross-school), each with a nested `attendance` array. No guardian id or
 * admin permission required — the backend scopes to the caller.
 */
export async function fetchParentChildren(
  params: AttendanceParams = {},
): Promise<ChildAttendance[]> {
  const { data } = await apiClient.get<Dict>(ATTENDANCE.PARENT_CHILDREN, { params })
  if (Array.isArray(data?.children)) return data.children as ChildAttendance[]
  return normalizeCollection<ChildAttendance>(data)
}

/** Flatten each child's nested attendance into table-ready rows. */
export async function fetchParentAttendanceRecords(
  params: AttendanceParams = {},
): Promise<AttendanceRecord[]> {
  const children = await fetchParentChildren(params)
  return children.flatMap((child) =>
    (child.attendance ?? []).map((record) => ({
      ...record,
      student_id: child.student_id,
      student_name: child.student_name,
      admission_number: child.admission_number,
      class_name: child.current_class,
      school: child.school,
    })),
  )
}

/** Student: the caller's OWN attendance (backend-scoped to self). */
export async function fetchMyAttendance(
  params: AttendanceParams = {},
): Promise<AttendanceRecord[]> {
  const { data } = await apiClient.get<Dict>(ATTENDANCE.STUDENTS, { params })
  return normalizeCollection<AttendanceRecord>(data)
}
