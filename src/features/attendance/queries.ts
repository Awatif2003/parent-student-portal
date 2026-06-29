import { queryOptions } from "@tanstack/react-query"

import {
  fetchMyAttendance,
  fetchParentAttendanceRecords,
  fetchParentChildren,
  type AttendanceParams,
} from "./api"

export const attendanceKeys = {
  all: ["attendance"] as const,
  parentChildren: (p: AttendanceParams) => [...attendanceKeys.all, "parent-children", p] as const,
  parentRecords: (p: AttendanceParams) => [...attendanceKeys.all, "parent-records", p] as const,
  myRecords: (p: AttendanceParams) => [...attendanceKeys.all, "my-records", p] as const,
}

export function parentChildrenQueryOptions(params: AttendanceParams = {}) {
  return queryOptions({
    queryKey: attendanceKeys.parentChildren(params),
    queryFn: () => fetchParentChildren(params),
    staleTime: 30_000,
  })
}

export function parentAttendanceQueryOptions(params: AttendanceParams = {}) {
  return queryOptions({
    queryKey: attendanceKeys.parentRecords(params),
    queryFn: () => fetchParentAttendanceRecords(params),
    staleTime: 30_000,
  })
}

export function myAttendanceQueryOptions(params: AttendanceParams = {}) {
  return queryOptions({
    queryKey: attendanceKeys.myRecords(params),
    queryFn: () => fetchMyAttendance(params),
    staleTime: 30_000,
  })
}
