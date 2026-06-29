import { useQuery } from "@tanstack/react-query"

import {
  myAttendanceQueryOptions,
  parentAttendanceQueryOptions,
  parentChildrenQueryOptions,
} from "./queries"
import type { AttendanceParams } from "./api"

export function useParentChildren(params: AttendanceParams = {}) {
  return useQuery(parentChildrenQueryOptions(params))
}

export function useParentAttendance(params: AttendanceParams = {}) {
  return useQuery(parentAttendanceQueryOptions(params))
}

export function useMyAttendance(params: AttendanceParams = {}) {
  return useQuery(myAttendanceQueryOptions(params))
}
