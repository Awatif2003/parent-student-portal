import { useQuery } from "@tanstack/react-query"

import {
  attendanceSummaryQueryOptions,
  examSummaryQueryOptions,
  financeSummaryQueryOptions,
  overviewQueryOptions,
} from "./queries"

export const useOverview = () => useQuery(overviewQueryOptions())
export const useAttendanceSummary = () => useQuery(attendanceSummaryQueryOptions())
export const useExamSummary = () => useQuery(examSummaryQueryOptions())
export const useFinanceSummary = () => useQuery(financeSummaryQueryOptions())
