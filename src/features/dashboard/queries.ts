import { queryOptions } from "@tanstack/react-query"

import {
  fetchAttendanceSummary,
  fetchExamSummary,
  fetchFinanceSummary,
  fetchOverview,
} from "./api"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  section: (name: string) => [...dashboardKeys.all, name] as const,
}

const STALE = 60_000

export const overviewQueryOptions = () =>
  queryOptions({ queryKey: dashboardKeys.section("overview"), queryFn: fetchOverview, staleTime: STALE })

export const attendanceSummaryQueryOptions = () =>
  queryOptions({ queryKey: dashboardKeys.section("attendance"), queryFn: fetchAttendanceSummary, staleTime: STALE })

export const examSummaryQueryOptions = () =>
  queryOptions({ queryKey: dashboardKeys.section("exams"), queryFn: fetchExamSummary, staleTime: STALE })

export const financeSummaryQueryOptions = () =>
  queryOptions({ queryKey: dashboardKeys.section("finance"), queryFn: fetchFinanceSummary, staleTime: STALE })
