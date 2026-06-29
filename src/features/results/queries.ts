import { queryOptions } from "@tanstack/react-query"

import { fetchContinuousAssessment, fetchReportCards, fetchTermResults } from "./api"

export const resultsKeys = {
  all: ["results"] as const,
  termResults: () => [...resultsKeys.all, "term-results"] as const,
  reportCards: () => [...resultsKeys.all, "report-cards"] as const,
  continuousAssessment: (studentId: string, termId?: string) =>
    [...resultsKeys.all, "continuous-assessment", studentId, termId ?? null] as const,
}

export function termResultsQueryOptions() {
  return queryOptions({
    queryKey: resultsKeys.termResults(),
    queryFn: fetchTermResults,
    staleTime: 60_000,
  })
}

export function reportCardsQueryOptions() {
  return queryOptions({
    queryKey: resultsKeys.reportCards(),
    queryFn: fetchReportCards,
    staleTime: 60_000,
  })
}

export function continuousAssessmentQueryOptions(studentId: string, termId?: string) {
  return queryOptions({
    queryKey: resultsKeys.continuousAssessment(studentId, termId),
    queryFn: () => fetchContinuousAssessment(studentId, termId),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  })
}
